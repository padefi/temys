<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Servicio híbrido de Georef que combina API externa (con coordenadas) y DB local (fallback)
 *
 * Estrategia:
 * 1. Intenta API externa de Georef (tiene coordenadas precisas)
 * 2. Si falla (sin internet, timeout, etc), usa DB local como fallback
 * 3. Cachea resultados para mejorar performance
 * 4. Normaliza el calle_id para que SIEMPRE sea el id local de georef_calles
 */
class GeorefHybridService
{
    private const API_BASE_URL = 'https://apis.datos.gob.ar/georef/api';
    private const API_TIMEOUT = 3;
    private const CACHE_TTL = 3600;

    private GeorefSearchService $localService;

    public function __construct(GeorefSearchService $localService)
    {
        $this->localService = $localService;
    }

    public function buscarDirecciones(array $params): array
    {
        $cacheKey = 'georef_dir_' . md5(json_encode($params));

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($params) {
            try {
                $resultado = $this->buscarDireccionesAPI($params);

                if ($resultado['success'] && $resultado['cantidad'] > 0) {
                    $resultado['source'] = 'api_externa';
                    return $resultado;
                }
            } catch (\Exception $e) {
                Log::warning('API Georef no disponible, usando DB local', [
                    'error' => $e->getMessage(),
                ]);
            }

            $resultado = $this->localService->buscarDirecciones($params);
            $resultado['source'] = 'db_local';
            $resultado['warning'] = 'Coordenadas aproximadas (sin API externa)';

            return $resultado;
        });
    }

    public function buscarCalles(array $params): array
    {
        $cacheKey = 'georef_calles_' . md5(json_encode($params));

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($params) {
            try {
                $resultado = $this->buscarCallesAPI($params);

                if ($resultado['success'] && $resultado['cantidad'] > 0) {
                    $resultado['source'] = 'api_externa';
                    return $resultado;
                }
            } catch (\Exception $e) {
                Log::warning('API Georef no disponible, usando DB local', [
                    'error' => $e->getMessage(),
                ]);
            }

            $resultado = $this->localService->buscarCalles($params);
            $resultado['source'] = 'db_local';

            return $resultado;
        });
    }

    public function buscarProvincias(array $params): array
    {
        return $this->localService->buscarProvincias($params);
    }

    public function buscarLocalidades(array $params): array
    {
        return $this->localService->buscarLocalidades($params);
    }

    public function normalizarDireccion(array $params): array
    {
        return $this->localService->normalizarDireccion($params);
    }

    private function buscarDireccionesAPI(array $params): array
    {
        $queryParams = [
            'direccion' => trim(($params['calle'] ?? '') . ' ' . ($params['altura'] ?? '')),
            'max' => $params['max'] ?? 10,
        ];

        if (!empty($params['provincia'])) {
            $queryParams['provincia'] = $params['provincia'];
        }

        if (!empty($params['localidad'])) {
            $queryParams['localidad'] = $params['localidad'];
        }

        $response = Http::timeout(self::API_TIMEOUT)
            ->get(self::API_BASE_URL . '/direcciones', $queryParams);

        if (!$response->successful()) {
            throw new \Exception('API Georef error: ' . $response->status());
        }

        $data = $response->json();

        $direcciones = collect($data['direcciones'] ?? [])
            ->map(function ($dir) {
                $apiCalleId = isset($dir['calle']['id']) ? (string) $dir['calle']['id'] : null;
                $calleNombre = $dir['calle']['nombre'] ?? null;
                $localidad = $dir['localidad_censal']['nombre'] ?? null;
                $provincia = $dir['provincia']['nombre'] ?? null;
                $departamento = $dir['departamento']['nombre'] ?? null;
                $altura = $dir['altura']['valor'] ?? null;

                $calleLocal = $this->resolverCalleLocal(
                    $apiCalleId,
                    $calleNombre,
                    $provincia,
                    $localidad
                );

                return [
                    'calle_id' => $calleLocal?->id,
                    'calle_id_api' => $apiCalleId,
                    'calle_nombre' => $calleLocal?->nombre ?? $calleNombre ?? ($dir['nomenclatura'] ?? ''),
                    'altura' => $altura,
                    'localidad' => $calleLocal?->localidad_nombre ?? $localidad,
                    'provincia' => $calleLocal?->provincia_nombre ?? $provincia,
                    'departamento' => $calleLocal?->departamento_nombre ?? $departamento,
                    'lat' => $dir['ubicacion']['lat'] ?? null,
                    'lon' => $dir['ubicacion']['lon'] ?? null,
                    'nomenclatura' => $dir['nomenclatura'] ?? '',
                ];
            })
            ->filter(fn ($dir) => !empty($dir['calle_id']))
            ->values()
            ->toArray();

        return [
            'success' => true,
            'cantidad' => count($direcciones),
            'direcciones' => $direcciones,
        ];
    }

    private function buscarCallesAPI(array $params): array
    {
        $queryParams = [
            'nombre' => $params['nombre'],
            'max' => $params['max'] ?? 10,
        ];

        if (!empty($params['provincia'])) {
            $queryParams['provincia'] = $params['provincia'];
        }

        if (!empty($params['departamento'])) {
            $queryParams['departamento'] = $params['departamento'];
        }

        $response = Http::timeout(self::API_TIMEOUT)
            ->get(self::API_BASE_URL . '/calles', $queryParams);

        if (!$response->successful()) {
            throw new \Exception('API Georef error: ' . $response->status());
        }

        $data = $response->json();

        $calles = collect($data['calles'] ?? [])
            ->map(function ($calle) {
                $apiCalleId = isset($calle['id']) ? (string) $calle['id'] : null;
                $nombre = $calle['nombre'] ?? null;
                $provincia = $calle['provincia']['nombre'] ?? null;
                $departamento = $calle['departamento']['nombre'] ?? null;

                $calleLocal = $this->resolverCalleLocal(
                    $apiCalleId,
                    $nombre,
                    $provincia,
                    null
                );

                return [
                    'id' => $calleLocal?->id,
                    'id_api' => $apiCalleId,
                    'nombre' => $calleLocal?->nombre ?? $nombre ?? '',
                    'categoria' => $calle['categoria'] ?? null,
                    'provincia' => $calleLocal?->provincia_nombre ?? $provincia,
                    'departamento' => $calleLocal?->departamento_nombre ?? $departamento,
                    'altura_inicio' => $calle['altura']['inicio']['valor'] ?? null,
                    'altura_fin' => $calle['altura']['fin']['valor'] ?? null,
                ];
            })
            ->filter(fn ($calle) => !empty($calle['id']))
            ->values()
            ->toArray();

        return [
            'success' => true,
            'cantidad' => count($calles),
            'calles' => $calles,
        ];
    }

    /**
     * Intenta resolver una calle de la API externa contra georef_calles local.
     * La prioridad es:
     * 1. Match exacto por id
     * 2. Match por nombre + provincia + localidad
     * 3. Match por nombre + provincia
     * 4. Match por nombre solamente
     */
    private function resolverCalleLocal(
        ?string $apiCalleId,
        ?string $nombre,
        ?string $provincia,
        ?string $localidad
    ): ?object {
        if (!empty($apiCalleId)) {
            $exacta = DB::table('georef_calles')
                ->where('id', trim($apiCalleId))
                ->first();

            if ($exacta) {
                return $exacta;
            }
        }

        if (empty($nombre)) {
            return null;
        }

        $query = DB::table('georef_calles')
            ->whereRaw('UPPER(TRIM(nombre)) = ?', [mb_strtoupper(trim($nombre))]);

        if (!empty($provincia)) {
            $query->whereRaw('UPPER(TRIM(provincia_nombre)) = ?', [mb_strtoupper(trim($provincia))]);
        }

        if (!empty($localidad)) {
            $conLocalidad = (clone $query)
                ->whereRaw('UPPER(TRIM(localidad_nombre)) = ?', [mb_strtoupper(trim($localidad))])
                ->first();

            if ($conLocalidad) {
                return $conLocalidad;
            }
        }

        $sinLocalidad = $query->first();

        return $sinLocalidad ?: null;
    }

    /*
     * Verifica si la API externa está disponible
    */
     public function isAPIAvailable(): bool
    {
        try {
            $response = Http::timeout(2)->get(self::API_BASE_URL . '/provincias', ['max' => 1]);
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    public function clearCache(): void
    {
        Cache::flush();
    }
}