<?php

namespace App\Http\Controllers\Inventario\Operaciones;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\RecepcionesResource;
use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecepcionesController extends Controller
{
    public function index()
    {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');
        $recepciones = QueryBuilder::for(
            InventarioRecepcionProducto::query()
                ->SELECT(
                    'inventario_recepcion_productos.*',
                    'ao.nombre as origen',
                    'ad.nombre as destino',
                    DB::raw('CONCAT(u.name," ",u.last_name) as usuarioCreacion')
                )
                ->join('users as u', 'inventario_recepcion_productos.usuario_creacion', '=', 'u.id')
                ->leftJoin('almacenes as ao', 'inventario_recepcion_productos.origen_id', '=', 'ao.id')
                ->leftJoin('almacenes as ad', 'inventario_recepcion_productos.destino_id', '=', 'ad.id')
        )
            ->allowedFilters([
                AllowedFilter::exact('origen_id'),
                AllowedFilter::exact('destino_id'),
                AllowedFilter::exact('tipo_recepcion'),
                AllowedFilter::exact('estado'),
            ])->get();

        return Inertia::render('Inventario/Recepciones/RecepcionesManagement', [
            'recepcionProductos' => RecepcionesResource::collection($recepciones),
        ]);
    }

    // RecepcionController.php
    public function ControlRecepcion(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            foreach ($request->productos as $detalle) {
                $cantidadContada = $detalle['cantidad_contada'];

                // Crear movimiento
                InventarioMovimientoStock::create([
                    'producto_id' => $detalle['producto_id'],
                    'origen_id' => $recepcion->origen_id,
                    'destino_id' => $recepcion->destino_id,
                    'cantidad' => $cantidadContada,
                    'tipo_movimiento' => 'reposicion',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => Auth::id(),
                ]);

                // Actualizar stock
                InventarioStock::where('producto_id', $detalle['producto_id'])
                    ->where('almacen_id', $recepcion->origen_id)
                    ->update([
                        'cantidad_actual' => DB::raw('cantidad_actual + ' . (int) $cantidadContada),
                        'usuario_actualizacion' => Auth::id(),
                        'fecha_actualizacion' => now(),
                    ]);
            }

            // Actualizar cantidades recibidas en los detalles
            foreach ($recepcion->detalles as $detalle) {
                $productoRequest = collect($request->productos)
                    ->firstWhere('producto_id', $detalle->producto_id);

                if ($productoRequest) {
                    $detalle->cantidad_recibida = $productoRequest['cantidad_contada'];
                    $detalle->save();
                }
            }

            // Cambiar estado general de la recepción
            $recepcion->update([
                'estado' => 'completa',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);
        });

        return response()->json(['message' => 'Recepción aceptada correctamente.']);
    }

    /* 
    public function cancelar(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            $recepcion->update([
                'estado' => 'Cancelada',
                'motivo' => $request->motivo ?? '',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);

            // Registrar movimiento tipo "cancelacion" (sin modificar stock)
            foreach ($recepcion->detalles as $detalle) {
                InventarioMovimientoStock::create([
                    'producto_id' => $detalle->producto_id,
                    'origen_id' => $recepcion->origen_id,
                    'destino_id' => $recepcion->destino_id,
                    'cantidad' => 0,
                    'tipo_movimiento' => 'cancelacion',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => Auth::id(),
                    'descripcion' => 'Cancelación de recepción ID ' . $recepcion->id,
                ]);
            }
        });

        return response()->json(['message' => 'Recepción cancelada correctamente.']);
    } */
}
