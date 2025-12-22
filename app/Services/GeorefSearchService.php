<?php

namespace App\Services;

use App\Models\Georef\Calle;
use App\Models\Georef\Provincia;
use App\Models\Georef\Localidad;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Servicio para búsquedas optimizadas en la base de datos local de Georef
 * 
 * Reemplaza las llamadas HTTP a la API externa con consultas SQL optimizadas
 */
class GeorefSearchService
{
    private ?bool $alturaRangeColumnsAvailable = null;

    private function alturaRangeColumnsAvailable(): bool
    {
        if ($this->alturaRangeColumnsAvailable !== null) {
            return $this->alturaRangeColumnsAvailable;
        }

        $this->alturaRangeColumnsAvailable =
            Schema::hasColumn('georef_calles', 'altura_min') &&
            Schema::hasColumn('georef_calles', 'altura_max');

        return $this->alturaRangeColumnsAvailable;
    }

    private function normalizeProvinciaInput(?string $provincia): ?string
    {
        if ($provincia === null) {
            return null;
        }

        $p = trim(mb_strtolower($provincia));
        if ($p === '') {
            return null;
        }

        $aliases = [
            'caba' => 'Ciudad Autónoma de Buenos Aires',
            'capital federal' => 'Ciudad Autónoma de Buenos Aires',
            'ciudad autonoma de buenos aires' => 'Ciudad Autónoma de Buenos Aires',
            'bs as' => 'Buenos Aires',
            'buenos aires' => 'Buenos Aires',
            'provincia de buenos aires' => 'Buenos Aires',
        ];

        return $aliases[$p] ?? $provincia;
    }

    private function normalizeLocalidadInput(?string $localidad): ?string
    {
        if ($localidad === null) {
            return null;
        }

        $l = trim(mb_strtolower($localidad));
        if ($l === '') {
            return null;
        }

        $aliases = [
            'caba' => 'Ciudad Autónoma de Buenos Aires',
            'capital federal' => 'Ciudad Autónoma de Buenos Aires',
            'ciudad autonoma de buenos aires' => 'Ciudad Autónoma de Buenos Aires',
            'la plata' => 'La Plata',
        ];

        return $aliases[$l] ?? $localidad;
    }

    private function buildBooleanSearch(string $text): ?string
    {
        $terms = preg_split('/\s+/', trim($text)) ?: [];

        $normalized = [];
        foreach ($terms as $t) {
            $t = preg_replace('/[^\p{L}\p{N}_-]+/u', '', $t);
            if (!$t) {
                continue;
            }
            if (mb_strlen($t) < 2) {
                continue;
            }
            $normalized[] = '+' . $t . '*';
        }

        if (empty($normalized)) {
            return null;
        }

        return implode(' ', $normalized);
    }

    private function resolveProvinciaIds(?string $provincia, int $max = 10): array
    {
        $provincia = $this->normalizeProvinciaInput($provincia);
        if (!$provincia || trim($provincia) === '') {
            return [];
        }

        return Provincia::query()
            ->where('nombre', 'LIKE', '%' . $provincia . '%')
            ->limit($max)
            ->pluck('id')
            ->all();
    }

    private function resolveLocalidadIds(?string $localidad, array $provinciaIds = [], int $max = 30): array
    {
        $localidad = $this->normalizeLocalidadInput($localidad);
        if (!$localidad || trim($localidad) === '') {
            return [];
        }

        $query = Localidad::query()
            ->select(['id', 'localidad_censal_id'])
            ->where('nombre', 'LIKE', '%' . $localidad . '%');

        if (!empty($provinciaIds)) {
            $query->whereIn('provincia_id', $provinciaIds);
        }

        $rows = $query->limit($max)->get();

        $ids = [];
        foreach ($rows as $row) {
            if (!empty($row->localidad_censal_id)) {
                $ids[] = (string) $row->localidad_censal_id;
            }
            if (!empty($row->id)) {
                $ids[] = (string) $row->id;
            }
        }

        return array_values(array_unique($ids));
    }

    /**
     * Busca direcciones (calles con altura) en la base de datos local
     * 
     * Implementa la misma lógica que la API Georef:
     * 1. Busca con altura específica
     * 2. Si no hay resultados, busca con altura=1 (búsqueda de respaldo)
     */
    public function buscarDirecciones(array $params): array
    {
        $calle = $params['calle'] ?? null;
        $altura = $params['altura'] ?? null;
        $provincia = $params['provincia'] ?? null;
        $localidad = $params['localidad'] ?? null;
        $max = $params['max'] ?? 10;

        if (!$calle) {
            return $this->emptyResponse();
        }

        // Búsqueda principal con altura específica
        $resultados = $this->buscarCallesConAltura($calle, $altura, $provincia, $localidad, $max);

        // Si no hay resultados y se especificó altura, buscar con altura=1 (respaldo)
        if ($resultados->isEmpty() && $altura) {
            $resultados = $this->buscarCallesConAltura($calle, 1, $provincia, $localidad, $max);
            
            // Marcar como altura manual
            $resultados = $resultados->map(function ($calle) use ($altura) {
                $calle->altura_manual = true;
                $calle->altura_original = null;
                $calle->altura_buscada = $altura;
                return $calle;
            });
        }

        return $this->formatDireccionesResponse($resultados, $altura);
    }

    /**
     * Busca calles por nombre (sin altura)
     * 
     * OPTIMIZADO: Usa JOINs en lugar de queries secuenciales
     */
    public function buscarCalles(array $params): array
    {
        $nombre = $params['nombre'] ?? null;
        $provincia = $params['provincia'] ?? null;
        $departamento = $params['departamento'] ?? null;
        $max = $params['max'] ?? 10;

        if (!$nombre) {
            return $this->emptyResponse('calles');
        }

        $query = Calle::query()
            ->select('georef_calles.*');

        // Búsqueda optimizada con full-text o LIKE
        if (strlen($nombre) >= 3) {
            $boolean = $this->buildBooleanSearch($nombre);
            $query->where(function ($q) use ($nombre, $boolean) {
                $q->where('georef_calles.nombre', 'LIKE', "%{$nombre}%");
                if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
                    $q->orWhereRaw("MATCH(georef_calles.nombre) AGAINST(? IN BOOLEAN MODE)", [$boolean]);
                }
            });

            if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
                $query->orderByRaw("MATCH(georef_calles.nombre) AGAINST(? IN BOOLEAN MODE) DESC", [$boolean]);
            } else {
                $query->orderBy('georef_calles.nombre');
            }
        }

        if ($provincia) {
            $provinciaIds = $this->resolveProvinciaIds($provincia);
            if (!empty($provinciaIds)) {
                $query->whereIn('georef_calles.provincia_id', $provinciaIds);
            } else {
                $query->where('georef_calles.provincia_nombre', 'LIKE', "%{$provincia}%");
            }
        }

        if ($departamento) {
            $query->where('georef_calles.departamento_nombre', 'LIKE', "%{$departamento}%");
        }

        $calles = $query->limit($max)->get();

        return $this->formatCallesResponse($calles);
    }

    /**
     * Busca provincias por nombre
     */
    public function buscarProvincias(array $params): array
    {
        $nombre = $params['nombre'] ?? null;
        $max = $params['max'] ?? 10;

        if (!$nombre || strlen($nombre) < 2) {
            return $this->emptyResponse('provincias');
        }

        $query = Provincia::query();

        // Provincias: en este esquema no hay FULLTEXT index por defecto
        $query->where('nombre', 'LIKE', "%{$nombre}%");

        $provincias = $query->limit($max)->get();

        // Eliminar duplicados por id
        $provinciasUnicas = $provincias->unique('id')->values();

        return [
            'success' => true,
            'cantidad' => $provinciasUnicas->count(),
            'provincias' => $provinciasUnicas->map(fn($p) => [
                'id' => $p->id,
                'nombre' => $p->nombre,
            ])->toArray(),
        ];
    }

    /**
     * Busca localidades por nombre
     * 
     * OPTIMIZADO: Usa JOIN para filtro de provincia
     */
    public function buscarLocalidades(array $params): array
    {
        $nombre = $params['nombre'] ?? null;
        $provincia = $params['provincia'] ?? null;
        $max = $params['max'] ?? 10;

        if (!$nombre || strlen($nombre) < 2) {
            return $this->emptyResponse('localidades');
        }

        $query = Localidad::query()->select('georef_localidades.*');

        // Búsqueda por nombre
        $boolean = $this->buildBooleanSearch($nombre);
        $query->where(function ($q) use ($nombre, $boolean) {
            $q->where('georef_localidades.nombre', 'LIKE', "%{$nombre}%");
            if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
                $q->orWhereRaw("MATCH(georef_localidades.nombre) AGAINST(? IN BOOLEAN MODE)", [$boolean]);
            }
        });

        if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
            $query->orderByRaw("MATCH(georef_localidades.nombre) AGAINST(? IN BOOLEAN MODE) DESC", [$boolean]);
        } else {
            $query->orderBy('georef_localidades.nombre');
        }

        if ($provincia) {
            $provinciaIds = $this->resolveProvinciaIds($provincia);
            if (!empty($provinciaIds)) {
                $query->whereIn('georef_localidades.provincia_id', $provinciaIds);
            } else {
                $query->where('georef_localidades.provincia_nombre', 'LIKE', "%{$provincia}%");
            }
        }

        $localidades = $query->limit($max)->get();

        // Eliminar duplicados por id
        $localidadesUnicas = $localidades->unique('id')->values();

        return [
            'success' => true,
            'cantidad' => $localidadesUnicas->count(),
            'localidades' => $localidadesUnicas->map(fn($l) => [
                'id' => $l->id,
                'nombre' => $l->nombre,
                'provincia' => $l->provincia_nombre ?? null,
            ])->toArray(),
        ];
    }

    /**
     * Normaliza una dirección (busca la más cercana)
     */
    public function normalizarDireccion(array $params): array
    {
        $calle = $params['calle'] ?? null;
        $altura = $params['altura'] ?? null;
        $provincia = $params['provincia'] ?? null;

        $resultados = $this->buscarDirecciones([
            'calle' => $calle,
            'altura' => $altura,
            'provincia' => $provincia,
            'max' => 1,
        ]);

        if (empty($resultados['direcciones'])) {
            return [
                'success' => false,
                'message' => 'No se encontró la dirección especificada',
            ];
        }

        return [
            'success' => true,
            'direccion' => $resultados['direcciones'][0],
        ];
    }

    /**
     * Busca calles con altura específica (método privado optimizado)
     * 
     * OPTIMIZADO: Usa JOINs en lugar de queries secuenciales
     * Reducción de 3-5 queries a 1 sola query
     */
    private function buscarCallesConAltura(
        string $calle,
        ?int $altura,
        ?string $provincia,
        ?string $localidad,
        int $max
    ): Collection {
        $query = Calle::query()
            ->select([
                'georef_calles.*',
                DB::raw('COALESCE(loc_c.centroide_lat, loc.centroide_lat, prov.centroide_lat) as approx_lat'),
                DB::raw('COALESCE(loc_c.centroide_lon, loc.centroide_lon, prov.centroide_lon) as approx_lon'),
                DB::raw('COALESCE(loc_c.nombre, loc.nombre, georef_calles.localidad_censal_nombre, georef_calles.localidad_nombre) as localidad_norm'),
                DB::raw('COALESCE(prov.nombre, georef_calles.provincia_nombre) as provincia_norm'),
            ])
            ->leftJoin('georef_localidades as loc_c', 'georef_calles.localidad_censal_id', '=', 'loc_c.localidad_censal_id')
            ->leftJoin('georef_localidades as loc', 'georef_calles.localidad_id', '=', 'loc.id')
            ->leftJoin('georef_provincias as prov', 'georef_calles.provincia_id', '=', 'prov.id');

        $boolean = $this->buildBooleanSearch($calle);
        $query->where(function ($q) use ($calle, $boolean) {
            $q->where('georef_calles.nombre', 'LIKE', "%{$calle}%");
            if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
                $q->orWhereRaw("MATCH(georef_calles.nombre) AGAINST(? IN BOOLEAN MODE)", [$boolean]);
            }
        });

        if (DB::connection()->getDriverName() === 'mysql' && $boolean) {
            $query->orderByRaw("MATCH(georef_calles.nombre) AGAINST(? IN BOOLEAN MODE) DESC", [$boolean]);
        }

        if ($provincia) {
            $provinciaIds = $this->resolveProvinciaIds($provincia);
            if (!empty($provinciaIds)) {
                $query->whereIn('georef_calles.provincia_id', $provinciaIds);
            } else {
                $query->where('georef_calles.provincia_nombre', 'LIKE', "%{$provincia}%");
            }
        } else {
            $provinciaIds = [];
        }

        if ($localidad) {
            $localidadIds = $this->resolveLocalidadIds($localidad, $provinciaIds);
            if (!empty($localidadIds)) {
                $query->where(function ($q) use ($localidadIds) {
                    $q->whereIn('georef_calles.localidad_censal_id', $localidadIds)
                      ->orWhereIn('georef_calles.localidad_id', $localidadIds);
                });
            } else {
                $query->where(function ($q) use ($localidad) {
                    $q->where('georef_calles.localidad_censal_nombre', 'LIKE', "%{$localidad}%")
                      ->orWhere('georef_calles.localidad_nombre', 'LIKE', "%{$localidad}%");
                });
            }
        }

        if ($altura) {
            if ($this->alturaRangeColumnsAvailable()) {
                $query->whereRaw(
                    '(georef_calles.altura_min IS NOT NULL AND georef_calles.altura_max IS NOT NULL AND ? BETWEEN georef_calles.altura_min AND georef_calles.altura_max)',
                    [$altura]
                );
            } else {
                $query->where(function ($q) use ($altura) {
                    $q->orWhereRaw(
                        '(georef_calles.altura_inicio_derecha IS NOT NULL AND georef_calles.altura_fin_derecha IS NOT NULL AND ? BETWEEN LEAST(georef_calles.altura_inicio_derecha, georef_calles.altura_fin_derecha) AND GREATEST(georef_calles.altura_inicio_derecha, georef_calles.altura_fin_derecha))',
                        [$altura]
                    );
                    $q->orWhereRaw(
                        '(georef_calles.altura_inicio_izquierda IS NOT NULL AND georef_calles.altura_fin_izquierda IS NOT NULL AND ? BETWEEN LEAST(georef_calles.altura_inicio_izquierda, georef_calles.altura_fin_izquierda) AND GREATEST(georef_calles.altura_inicio_izquierda, georef_calles.altura_fin_izquierda))',
                        [$altura]
                    );
                });
            }
        }

        return $query->limit($max)->get();
    }

    /**
     * Formatea la respuesta de direcciones (compatible con API Georef)
     */
    private function formatDireccionesResponse(Collection $calles, ?int $alturaBuscada = null): array
    {
        $direcciones = $calles->map(function ($calle) use ($alturaBuscada) {
            $altura = $alturaBuscada;

            return [
                'calle_id' => (string) $calle->id,
                'calle_nombre' => $calle->nombre,
                'altura' => $altura,
                'localidad' => $calle->localidad_norm ?? $calle->localidad_censal_nombre ?? $calle->localidad_nombre ?? 'N/A',
                'provincia' => $calle->provincia_norm ?? $calle->provincia_nombre ?? 'N/A',
                'departamento' => $calle->departamento_nombre ?? null,
                'lat' => isset($calle->approx_lat) ? (float) $calle->approx_lat : null,
                'lon' => isset($calle->approx_lon) ? (float) $calle->approx_lon : null,
                'nomenclatura' => $altura !== null ? "{$calle->nombre} {$altura}" : $calle->nombre,
                'alturaManual' => $calle->altura_manual ?? false,
                'alturaOriginal' => $calle->altura_original ?? null,
            ];
        })
        ->unique('calle_id')
        ->values()
        ->toArray();

        return [
            'success' => true,
            'cantidad' => count($direcciones),
            'direcciones' => $direcciones,
        ];
    }

    /**
     * Formatea la respuesta de calles
     * OPTIMIZADO: Filtra duplicados por id
     */
    private function formatCallesResponse(Collection $calles): array
    {
        $callesFormateadas = $calles->map(function ($c) {
            $inicios = array_filter([
                $c->altura_inicio_derecha,
                $c->altura_inicio_izquierda,
            ], fn($v) => $v !== null);

            $fines = array_filter([
                $c->altura_fin_derecha,
                $c->altura_fin_izquierda,
            ], fn($v) => $v !== null);

            $alturaInicio = empty($inicios) ? null : min($inicios);
            $alturaFin = empty($fines) ? null : max($fines);

            return [
                'id' => ctype_digit((string) $c->id) ? (int) $c->id : $c->id,
                'nombre' => $c->nombre,
                'categoria' => $c->categoria,
                'altura_inicio' => $alturaInicio,
                'altura_fin' => $alturaFin,
                'provincia' => $c->provincia_nombre ?? null,
                'departamento' => $c->departamento_nombre ?? null,
                'localidad_censal' => $c->localidad_censal_nombre ?? $c->localidad_nombre ?? null,
            ];
        })
        ->unique('id')
        ->values()
        ->toArray();

        return [
            'success' => true,
            'cantidad' => count($callesFormateadas),
            'calles' => $callesFormateadas,
        ];
    }

    /**
     * Respuesta vacía estandarizada
     */
    private function emptyResponse(string $type = 'direcciones'): array
    {
        return [
            'success' => true,
            'cantidad' => 0,
            $type => [],
        ];
    }
}
