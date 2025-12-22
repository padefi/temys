<?php

namespace App\Http\Controllers\Georef;

use App\Http\Controllers\Controller;
use App\Services\GeorefHybridService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controlador para gestionar búsquedas de direcciones con sistema híbrido
 * 
 * VERSIÓN HÍBRIDA: Intenta primero API externa de Georef (con coordenadas precisas),
 * si falla usa base de datos local como fallback.
 * 
 * Actualizado a sistema híbrido - Diciembre 2024
 */
class GeorefController extends Controller
{
    /**
     * Servicio híbrido de búsqueda de Georef (API + DB local)
     */
    private GeorefHybridService $georefService;

    public function __construct(GeorefHybridService $georefService)
    {
        $this->georefService = $georefService;
    }

    /**
     * Busca direcciones (calles con altura) con sistema híbrido
     * 
     * Estrategia:
     * 1. Intenta API externa de Georef (coordenadas precisas)
     * 2. Si falla, usa DB local como fallback
     * 3. Implementa búsqueda de respaldo con altura=1 si no hay resultados
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function buscarDirecciones(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'calle' => 'required|string|min:3',
            'altura' => 'nullable|numeric',
            'provincia' => 'nullable|string',
            'localidad' => 'nullable|string',
            'max' => 'nullable|numeric|min:1|max:50',
        ]);

        try {
            $resultado = $this->georefService->buscarDirecciones([
                'calle' => $validated['calle'],
                'altura' => $validated['altura'] ?? null,
                'provincia' => $validated['provincia'] ?? null,
                'localidad' => $validated['localidad'] ?? null,
                'max' => $validated['max'] ?? 10,
            ]);

            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error en buscarDirecciones (DB local)', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error interno al buscar direcciones',
                'message' => config('app.debug') ? $e->getMessage() : 'Error en la búsqueda',
            ], 500);
        }
    }

    /**
     * Busca calles por nombre con sistema híbrido
     * 
     * Intenta API externa primero (con coordenadas), fallback a DB local
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function buscarCalles(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|min:3',
            'provincia' => 'nullable|string',
            'departamento' => 'nullable|string',
            'max' => 'nullable|numeric|min:1|max:50',
        ]);

        try {
            $resultado = $this->georefService->buscarCalles([
                'nombre' => $validated['nombre'],
                'provincia' => $validated['provincia'] ?? null,
                'departamento' => $validated['departamento'] ?? null,
                'max' => $validated['max'] ?? 10,
            ]);

            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error en buscarCalles (DB local)', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error interno al buscar calles',
                'message' => config('app.debug') ? $e->getMessage() : 'Error en la búsqueda',
            ], 500);
        }
    }

    /**
     * Busca provincias por nombre en la base de datos local
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function buscarProvincias(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|min:2',
            'max' => 'nullable|numeric|min:1|max:50',
        ]);

        try {
            $resultado = $this->georefService->buscarProvincias([
                'nombre' => $validated['nombre'],
                'max' => $validated['max'] ?? 10,
            ]);

            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error en buscarProvincias (DB local)', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al buscar provincias',
            ], 500);
        }
    }

    /**
     * Busca localidades por nombre en la base de datos local
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function buscarLocalidades(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|min:2',
            'provincia' => 'nullable|string',
            'max' => 'nullable|numeric|min:1|max:50',
        ]);

        try {
            $resultado = $this->georefService->buscarLocalidades([
                'nombre' => $validated['nombre'],
                'provincia' => $validated['provincia'] ?? null,
                'max' => $validated['max'] ?? 10,
            ]);

            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error en buscarLocalidades (DB local)', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al buscar localidades',
            ], 500);
        }
    }

    /**
     * Normaliza una dirección específica
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function normalizarDireccion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'calle' => 'required|string',
            'altura' => 'required|numeric',
            'provincia' => 'nullable|string',
        ]);

        try {
            $resultado = $this->georefService->normalizarDireccion([
                'calle' => $validated['calle'],
                'altura' => $validated['altura'],
                'provincia' => $validated['provincia'] ?? null,
            ]);

            if (!$resultado['success']) {
                return response()->json($resultado, 404);
            }

            return response()->json($resultado);

        } catch (\Exception $e) {
            Log::error('Error en normalizarDireccion (DB local)', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al normalizar dirección',
            ], 500);
        }
    }

    /**
     * Verifica el estado de la API externa de Georef
     * 
     * @return JsonResponse
     */
    public function checkAPIStatus(): JsonResponse
    {
        $isAvailable = $this->georefService->isAPIAvailable();

        return response()->json([
            'api_available' => $isAvailable,
            'mode' => $isAvailable ? 'hybrid' : 'offline_only',
            'message' => $isAvailable
                ? 'API externa disponible - coordenadas precisas'
                : 'Modo offline - usando base de datos local',
        ]);
    }
}
