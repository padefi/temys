<?php

namespace Database\Seeders;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\Contabilidad\PlanCuentas\Rubro;
use Illuminate\Database\Seeder;

class PlanCuentasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ejercicio = Ejercicio::create([
            'descripcion' => '2025',
            'fecha_inicio' => '2025-01-01',
            'fecha_fin' => '2025-12-31',
            'estado' => 'ABIERTO',
            'model_id_created' => 1,
            'created_at' => now(),
        ]);

        $rubrosFile = storage_path('app/csv/ChartAccounts/rubros.csv');
        $cuentasFile = storage_path('app/csv/ChartAccounts/cuentas.csv');
        $subcuentasFile = storage_path('app/csv/ChartAccounts/subcuentas.csv');

        // Rubros
        $rubros = array_map(fn($line) => str_getcsv($line, ';'), file($rubrosFile));
        $cuentas = array_map(fn($line) => str_getcsv($line, ';'), file($cuentasFile));
        $subcuentas = array_map(fn($line) => str_getcsv($line, ';'), file($subcuentasFile));

        // Se ordenar los arrays por codigo
        foreach ([$rubros, $cuentas, $subcuentas] as &$arr)
        {
            usort($arr, function ($a, $b)
            {
                $codigoA = (int) trim($a[0], '"');
                $codigoB = (int) trim($b[0], '"');
                return $codigoA <=> $codigoB;
            });
        }

        $rubroMap = [];
        foreach ($rubros as $rubroData)
        {
            $codigo = trim($rubroData[0], '"');
            $descripcion = trim($rubroData[1], '"');
            $padreCodigo = strlen($codigo) > 1 ? substr($codigo, 0, strlen($codigo) - 1) : null;

            $rubro = $ejercicio->rubros()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'rubro_padre_id' => $padreCodigo ? ($rubroMap[$padreCodigo] ?? null) : null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $rubroMap[$codigo] = $rubro->id;
        }

        // Cuentas
        $cuentaMap = [];
        foreach ($cuentas as $cuentaData)
        {
            $codigo = trim($cuentaData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($cuentaData[1], '"'));
            $rubroCodigo = substr($codigo, 0, 3);
            $rubro = isset($rubroMap[$rubroCodigo]) ? Rubro::find($rubroMap[$rubroCodigo]) : null;

            if (!$rubro)
            {
                continue;
            }

            $cuenta = $rubro->cuentas()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'rubro_id' => $rubroMap[$rubroCodigo] ?? null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $cuentaMap[$codigo] = $cuenta->id;
        }

        // Subcuentas
        foreach ($subcuentas as $subData)
        {
            $codigo = trim($subData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($subData[1], '"'));
            $cuentaCodigo = substr($codigo, 0, 5);
            $cuenta = isset($cuentaMap[$cuentaCodigo]) ? Cuenta::find($cuentaMap[$cuentaCodigo]) : null;

            if (!$cuenta)
            {
                continue;
            }

            $cuenta->subcuentas()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'cuenta_id' => $cuentaMap[$cuentaCodigo] ?? null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);
        }
    }
}
