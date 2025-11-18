<?php

namespace App\Http\Controllers\Inventario\Operaciones;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\RecepcionesResource;
use App\Models\Inventario\InventarioEstadosTracking;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioRecepcionCancelada;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioRecepcionProductoDetalle;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\InventarioTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecepcionesController extends Controller
{
    public function index(Request $request)
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
                ->where('inventario_recepcion_productos.origen_id', $almacenId)
        )->allowedFilters([
            AllowedFilter::callback('estado', function ($query, $value) {
                $query->where('estado', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('fecha_recepcion', function ($query, $value) {
                $query->where('inventario_recepcion_productos.fecha_recepcion', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('tipo_recepcion', function ($query, $value) {
                $query->where('inventario_recepcion_productos.tipo_recepcion', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('origen', function ($query, $value) {
                $query->where('ao.nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('destino', function ($query, $value) {
                $query->where('ad.nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('usuarioCreacion', function ($query, $value) {
                $query->whereRaw("CONCAT(u.name, ' ', u.last_name) LIKE ?", ["%{$value}%"]);
            }),
            AllowedFilter::partial('cantidad_actual'),
        ])
            ->allowedSorts([
                'fecha_recepcion',
                'tipo_recepcion',
                'estado',
                'usuarioCreacion',
                'origen',
                'destino',
            ])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('Inventario/Recepciones/RecepcionesManagement', [
            'recepcionProductos' => RecepcionesResource::collection($recepciones),
        ]);
    }


    public function ControlRecepcion(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles.producto', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            $estadoGeneral = 'completa';

            foreach ($request->productos as $detalleRequest) {

                $detalle = $recepcion->detalles
                    ->firstWhere('producto_id', $detalleRequest['producto_id']);

                if (!$detalle) continue;

                $cantidadContada = $detalleRequest['cantidad_contada'];


                //Crear el movimiento a través de la relación polimórfica
                $movimiento = $detalle->movimientos()->create([
                    'producto_id' => $detalleRequest['producto_id'],
                    'origen_id' => $recepcion->destino_id,
                    'destino_id' => $recepcion->origen_id,
                    'cantidad' => $cantidadContada,
                    'tipo_movimiento' => 'recepcion',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => Auth::id(),
                ]);


                //Actualizar stock
                InventarioStock::where('producto_id', $detalleRequest['producto_id'])
                    ->where('almacen_id', $recepcion->destino_id)
                    ->update([
                        'cantidad_actual' => DB::raw('cantidad_actual + ' . (int) $detalleRequest['cantidad_contada']),
                        'usuario_actualizacion' => Auth::id(),
                        'fecha_actualizacion' => now(),
                    ]);

                $transito_id = InventarioTracking::where('entrega_id', $recepcion->orden_entrega_id)
                    ->value('id');

                InventarioEstadosTracking::create([
                    'seguimiento_id' => $transito_id,
                    'estado' => 'completado',
                    'usuario_id' => Auth::id(),
                    'fecha' => now(),
                    'observaciones' => 'Producto en llego al almacen ' . $recepcion->origen->nombre,
                ]);

                //Actualizar detalle de recepción
                $detalle->update([
                    'cantidad_recibida' => $cantidadContada,
                    'estado' => $detalleRequest['estado'] ?? 'completo',
                ]);

                // Detectar si el estado del detalle afecta al estado general
                if (($detalleRequest['estado'] ?? 'completo') !== 'completo') {
                    $estadoGeneral = 'parcial';
                }
            }

            //Cambiar estado general de la recepción
            $recepcion->update([
                'estado' => $estadoGeneral,
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
                'movimiento_stock_id' => $movimiento->id,
            ]);
            InventarioOrdenEntrega::where('id', $recepcion->orden_entrega_id)
                ->update([
                    'estado' => 'Entregado',
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]);
        });

        return response()->json(['message' => 'Recepción aceptada correctamente.']);
    }



    public function cancelar(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            $recepcion->update([
                'estado' => 'Cancelado',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);

            InventarioRecepcionCancelada::create([
                'recepcion_id' => $recepcion->id,
                'motivo' => $request->motivo,
                'fecha' => now(),
                'usuario' => Auth::id(),
            ]);

            $ordenRecepcion = InventarioRecepcionProducto::create([
                'origen_id' => $recepcion->destino_id,
                'destino_id' => $recepcion->origen_id,
                'orden_entrega_id' => null,
                'tipo_recepcion' => 'restitucion',
                'fecha_recepcion' => now(),
                'estado' => 'Pendiente',
                'usuario_creacion' => Auth::id(),
            ]);

            foreach ($recepcion->detalles as $producto) {
                InventarioRecepcionProductoDetalle::insert([
                    'recepcion_id' => $ordenRecepcion->id,
                    'producto_id' => $producto->producto_id,
                    'cantidad_esperada' => abs($producto->cantidad_esperada),
                ]);
            }
        });

        return response()->json(['message' => 'Recepción cancelada correctamente.']);
    }
}
