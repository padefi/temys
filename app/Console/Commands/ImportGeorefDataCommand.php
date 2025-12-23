<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class ImportGeorefDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'georef:import 
                            {type : Tipo de datos a importar (provincias|departamentos|localidades|calles|all)}
                            {--file= : Ruta del archivo CSV (opcional, usa storage/app/georef por defecto)}
                            {--chunk=1000 : Tamaño del lote para procesamiento}
                            {--truncate : Vaciar tabla antes de importar}';

    /**
     * The console command description.
     */
    protected $description = 'Importa datos de Georef desde archivos CSV a la base de datos local';

    /**
     * Configuración simplificada - Las columnas DB coinciden con CSV
     */
    private array $config = [
        'provincias' => [
            'table' => 'georef_provincias',
            'file' => 'georef/raw/provincias.csv',
            'unique_key' => 'id', // Columna única para upsert
        ],
        'departamentos' => [
            'table' => 'georef_departamentos',
            'file' => 'georef/raw/departamentos.csv',
            'unique_key' => 'id',
        ],
        'localidades' => [
            'table' => 'georef_localidades',
            'file' => 'georef/raw/localidades.csv',
            'unique_key' => 'id',
        ],
        'calles' => [
            'table' => 'georef_calles',
            'file' => 'georef/raw/calles.csv',
            'unique_key' => 'id',
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $type = $this->argument('type');

        if ($type === 'all') {
            $this->info('🚀 Importando todos los datos de Georef...');
            foreach (['provincias', 'departamentos', 'localidades', 'calles'] as $dataType) {
                $this->importType($dataType);
            }
            $this->info('✅ Importación completa finalizada');
            return Command::SUCCESS;
        }

        if (!isset($this->config[$type])) {
            $this->error("❌ Tipo inválido. Usa: provincias, departamentos, localidades, calles o all");
            return Command::FAILURE;
        }

        return $this->importType($type);
    }

    /**
     * Importa un tipo específico de datos
     */
    private function importType(string $type): int
    {
        $config = $this->config[$type];
        $table = $config['table'];
        $filePath = $this->option('file') ?? $config['file'];
        $chunkSize = (int) $this->option('chunk');
        $uniqueKey = $config['unique_key'];

        $tableColumns = Schema::getColumnListing($table);
        $allowedColumns = array_flip($tableColumns);

        $this->info("📥 Importando {$type}...");

        // Verificar que el archivo existe
        if (!Storage::exists($filePath)) {
            $this->error("❌ Archivo no encontrado: storage/app/{$filePath}");
            $this->warn("💡 Descarga los datos desde: https://datos.gob.ar/dataset/modernizacion-base-datos-georef");
            return Command::FAILURE;
        }

        // Truncar tabla si se solicita
        if ($this->option('truncate')) {
            $this->warn("⚠️  Vaciando tabla {$table}...");
            DB::table($table)->truncate();
        }

        // Leer CSV
        $csv = Reader::createFromPath(Storage::path($filePath), 'r');
        $csv->setHeaderOffset(0); // Primera fila como headers
        
        $records = $csv->getRecords();
        $totalRecords = iterator_count($csv->getRecords());
        
        $this->info("📊 Total de registros: " . number_format($totalRecords));

        // Reiniciar el iterador
        $records = $csv->getRecords();
        
        $bar = $this->output->createProgressBar($totalRecords);
        $bar->start();

        $batch = [];
        $processed = 0;
        $errors = 0;

        foreach ($records as $record) {
            try {
                // Filtrar a columnas existentes en la tabla (robusto ante CSVs con headers extra)
                $record = array_intersect_key($record, $allowedColumns);

                if (!array_key_exists($uniqueKey, $record) || $record[$uniqueKey] === null || $record[$uniqueKey] === '') {
                    throw new \RuntimeException("Registro sin '{$uniqueKey}' (header mismatch o dato inválido)");
                }

                // Agregar timestamps a cada registro
                if (array_key_exists('created_at', $allowedColumns)) {
                    $record['created_at'] = now();
                }
                if (array_key_exists('updated_at', $allowedColumns)) {
                    $record['updated_at'] = now();
                }
                $batch[] = $record;

                // Procesar lote cuando alcanza el tamaño configurado
                if (count($batch) >= $chunkSize) {
                    $this->upsertBatch($table, $batch, $uniqueKey);
                    $processed += count($batch);
                    $bar->advance(count($batch));
                    $batch = [];
                }
            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Error en registro ({$type}): " . $e->getMessage());
            }
        }

        // Procesar lote restante
        if (!empty($batch)) {
            $this->upsertBatch($table, $batch, $uniqueKey);
            $processed += count($batch);
            $bar->advance(count($batch));
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ {$type} importado exitosamente");
        $this->info("   📝 Procesados: " . number_format($processed));
        if ($errors > 0) {
            $this->warn("   ⚠️  Errores: " . number_format($errors));
        }

        return Command::SUCCESS;
    }

    /**
     * Limpia valores vacíos de un registro
     */
    private function cleanRecord(array $record): array
    {
        foreach ($record as $key => $value) {
            // Convertir strings vacíos y "null" a NULL real
            if ($value === '' || $value === 'null' || $value === 'NULL' || $value === '?') {
                $record[$key] = null;
                continue;
            }

            // Normalizar números (algunos CSV traen placeholders como '?')
            if (
                $value !== null &&
                (
                    str_starts_with($key, 'altura_') ||
                    str_starts_with($key, 'centroide_') ||
                    str_ends_with($key, '_lat') ||
                    str_ends_with($key, '_lon')
                )
            ) {
                $normalized = is_string($value) ? trim($value) : $value;
                if ($normalized === '' || $normalized === '?' || !is_numeric($normalized)) {
                    $record[$key] = null;
                    continue;
                }

                // Las alturas en CSV deberían ser >= 0; en algunos registros vienen negativas.
                // Las columnas en DB son unsignedInteger, así que convertimos negativas a NULL.
                if (str_starts_with($key, 'altura_') && (float) $normalized < 0) {
                    $record[$key] = null;
                }
            }
        }

        if (
            array_key_exists('altura_min', $record) ||
            array_key_exists('altura_max', $record)
        ) {
            $inicios = array_filter([
                $record['altura_inicio_derecha'] ?? null,
                $record['altura_inicio_izquierda'] ?? null,
            ], fn($v) => $v !== null);

            $fines = array_filter([
                $record['altura_fin_derecha'] ?? null,
                $record['altura_fin_izquierda'] ?? null,
            ], fn($v) => $v !== null);

            if (!empty($inicios) && !empty($fines)) {
                $record['altura_min'] = min(array_merge($inicios, $fines));
                $record['altura_max'] = max(array_merge($inicios, $fines));
            } else {
                $record['altura_min'] = null;
                $record['altura_max'] = null;
            }
        }
        
        return $record;
    }

    /**
     * Realiza upsert por lotes (insert o update si existe)
     * Simplificado: Las columnas DB coinciden con CSV, no requiere mapeo
     */
    private function upsertBatch(string $table, array $batch, string $uniqueKey): void
    {
        if (empty($batch)) {
            return;
        }

        try {
            // Limpiar registros antes de insertar
            $cleanBatch = array_map([$this, 'cleanRecord'], $batch);
                    
            DB::table($table)->upsert(
                $cleanBatch,
                [$uniqueKey], // Columna única para detectar duplicados
                array_keys($cleanBatch[0]) // Columnas a actualizar si existe
            );
        } catch (\Illuminate\Database\QueryException $e) {
            // Estrategia robusta: dividir el batch para aislar el/los registros problemáticos.
            // Esto cubre tanto errores de tamaño (max_allowed_packet) como datos inválidos.
            if (count($batch) === 1) {
                $recordId = $batch[0][$uniqueKey] ?? ($batch[0]['id'] ?? 'unknown');
                $this->error("❌ Error en registro {$table} {$uniqueKey}={$recordId}: " . $e->getMessage());
                return; // Saltar este registro y continuar
            }

            $halfSize = (int) ceil(count($batch) / 2);
            $firstHalf = array_slice($batch, 0, $halfSize);
            $secondHalf = array_slice($batch, $halfSize);

            $this->upsertBatch($table, $firstHalf, $uniqueKey);
            $this->upsertBatch($table, $secondHalf, $uniqueKey);
        }
    }
}
