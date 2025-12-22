<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Servicio híbrido de Georef que combina API externa (con coordenadas) y DB local (fallback)
 * 
 * Estrategia:
 * 1. Intenta API externa de Georef (tiene coordenadas precisas)
 * 2. Si falla (sin internet, timeout, etc), usa DB local como fallback
 * 3. Cachea resultados para mejorar performance
 */
class GeorefHybridService
{
    private const API_BASE_URL = 'https://apis.datos.gob.ar/georef/api';
    private const API_TIMEOUT = 3; // 3 segundos timeout
    private const CACHE_TTL = 3600; // 1 hora de cache

    private GeorefSearchService $localService;

    public function __construct(GeorefSearchService $localService)
    {
        $this->localService = $localService;
    }

    /**
     * Busca direcciones intentando primero API externa, luego DB local
     */
    public function buscarDirecciones(array $params): array
    {
        $cacheKey = 'georef_dir_' . md5(json_encode($params));

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($params) {
            // Intentar API externa primero
            try {
                $resultado = $this->buscarDireccionesAPI($params);
                
                if ($resultado['success'] && $resultado['cantidad'] > 0) {
                    $resultado['source'] = 'api_externa';
                    return $resultado;
                }
            } catch (\Exception $e) {
                Log::warning('API Georef no disponible, usando DB local', [
                    'error' => $e->getMessage()
                ]);
            }

            // Fallback a DB local
            $resultado = $this->localService->buscarDirecciones($params);
            $resultado['source'] = 'db_local';
            $resultado['warning'] = 'Coordenadas aproximadas (sin API externa)';
            
            return $resultado;
        });
    }

    /**
     * Busca calles intentando primero API externa, luego DB local
     */
    public function buscarCalles(array $params): array
    {
        $cacheKey = 'georef_calles_' . md5(json_encode($params));

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($params) {
            // Intentar API externa primero
            try {
                $resultado = $this->buscarCallesAPI($params);
                
                if ($resultado['success'] && $resultado['cantidad'] > 0) {
                    $resultado['source'] = 'api_externa';
                    return $resultado;
                }
            } catch (\Exception $e) {
                Log::warning('API Georef no disponible, usando DB local', [
                    'error' => $e->getMessage()
                ]);
            }

            // Fallback a DB local
            $resultado = $this->localService->buscarCalles($params);
            $resultado['source'] = 'db_local';
            
            return $resultado;
        });
    }

    /**
     * Busca provincias (solo DB local, no necesita coordenadas)
     */
    public function buscarProvincias(array $params): array
    {
        return $this->localService->buscarProvincias($params);
    }

    /**
     * Busca localidades (solo DB local, no necesita coordenadas)
     */
    public function buscarLocalidades(array $params): array
    {
        return $this->localService->buscarLocalidades($params);
    }

    /**
     * Normaliza dirección (solo DB local)
     */
    public function normalizarDireccion(array $params): array
    {
        return $this->localService->normalizarDireccion($params);
    }

    /**
     * Busca direcciones en la API externa de Georef
     */
    private function buscarDireccionesAPI(array $params): array
    {
        $queryParams = [
            'direccion' => $params['calle'] . ' ' . ($params['altura'] ?? ''),
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

        // Transformar respuesta de API a formato esperado
        return [
            'success' => true,
            'cantidad' => $data['cantidad'] ?? 0,
            'direcciones' => collect($data['direcciones'] ?? [])->map(function ($dir) {
                return [
                    'calle_id' => isset($dir['calle']['id']) ? (string) $dir['calle']['id'] : null,
                    'calle_nombre' => $dir['calle']['nombre'] ?? $dir['nomenclatura'] ?? '',
                    'altura' => $dir['altura']['valor'] ?? null,
                    'localidad' => $dir['localidad_censal']['nombre'] ?? null,
                    'provincia' => $dir['provincia']['nombre'] ?? null,
                    'departamento' => $dir['departamento']['nombre'] ?? null,
                    'lat' => $dir['ubicacion']['lat'] ?? null,
                    'lon' => $dir['ubicacion']['lon'] ?? null,
                    'nomenclatura' => $dir['nomenclatura'] ?? '',
                ];
            })->toArray(),
        ];
    }

    /**
     * Busca calles en la API externa de Georef
     */
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

        // Transformar respuesta de API a formato esperado
        return [
            'success' => true,
            'cantidad' => $data['cantidad'] ?? 0,
            'calles' => collect($data['calles'] ?? [])->map(function ($calle) {
                return [
                    'id' => isset($calle['id']) ? (string) $calle['id'] : null,
                    'nombre' => $calle['nombre'] ?? '',
                    'categoria' => $calle['categoria'] ?? null,
                    'provincia' => $calle['provincia']['nombre'] ?? null,
                    'departamento' => $calle['departamento']['nombre'] ?? null,
                    'altura_inicio' => $calle['altura']['inicio']['valor'] ?? null,
                    'altura_fin' => $calle['altura']['fin']['valor'] ?? null,
                ];
            })->toArray(),
        ];
    }

    /**
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

    /**
     * Limpia el cache de búsquedas
     */
    public function clearCache(): void
    {
        Cache::flush();
    }
}
