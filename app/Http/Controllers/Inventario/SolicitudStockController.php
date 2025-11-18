<?php

namespace App\Http\Controllers\Inventario;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AcceptStockRequest;
use App\Http\Requests\Inventario\CancelStockRequest;
use App\Http\Requests\Inventario\SolicitarStockRequest;
use App\Http\Resources\Inventario\SolicitudRecibidaDetalleResource;
use App\Http\Resources\inventario\SolicitudRecibidaStockResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioOrdenEntregaDetalle;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioRecepcionProductoDetalle;
use App\Models\Inventario\InventarioSolicitarStock;
use App\Models\Inventario\InventarioSolicitudDetalle;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\SolicitudRecibidaStock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class SolicitudStockController extends Controller
{
    public function solicitarStockMultiple(SolicitarStockRequest $request)
    {
        $validated = $request->validated();

        try {
            $first = $validated['solicitudes'][0];

            // Crear la solicitud general
            $solicitud = InventarioSolicitarStock::create([
                'almacen_solicitante_id' => $first['almacen_solicitante_id'],
                'almacen_proveedor_id' => $first['almacen_proveedor_id'],
                'prioridad' => $first['prioridad'],
                'estado' => 'Pendiente',
                'motivo' => $first['motivo'] ?? null,
                'fecha_creacion' => now(),
                'usuario_creacion' => Auth::id(),
            ]);

            // Agregar productos (detalles)
            foreach ($validated['solicitudes'] as $detalle) {
                InventarioSolicitudDetalle::create([
                    'solicitud_id' => $solicitud->id,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                ]);
            }

            return response()->json([
                'message' => 'Solicitud creada con múltiples productos.',
                'solicitud_id' => $solicitud->id,
                'success' => true

            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al procesar la solicitud.',
                'details' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function getSolicitudesAll()
    {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');

        $solicitudes = InventarioSolicitarStock::with([
            'almacensolicitante'
        ])
            ->where('almacen_proveedor_id',  $almacenId)
            ->where('estado', 'Pendiente')
            ->get();
        return response()->json(SolicitudRecibidaStockResource::collection($solicitudes));
    }

    public function getSolicitudDetalle($id)
    {
        $solicitud = InventarioSolicitarStock::with([
            'detalles.producto',
            'almacensolicitante',
            'almacenProovedor'
        ])->find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }
        return response()->json(new SolicitudRecibidaDetalleResource($solicitud));
    }

    public function getStockProducto($id, $idAlmacen)
    {
        $solicitud = InventarioSolicitarStock::with([
            'producto',
            'almacensolicitante',
            'almacenProovedor'
        ])->find($id, $idAlmacen);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        return response()->json(new SolicitudRecibidaStockResource($solicitud));
    }

    public function aceptarSolicitud(AcceptStockRequest $request)
    {
        $solicitud = InventarioSolicitarStock::with('detalles')->findOrFail($request->solicitud_id);

        $solicitud->estado = 'Aceptada';
        $solicitud->motivo = $request->motivo ?? '';
        $solicitud->usuario_actualizacion = Auth::id();
        $solicitud->fecha_actualizacion = now();
        $solicitud->save();

        // Actualizar cantidades aprobadas por producto
        foreach ($request->productos as $producto) {
            $detalle = $solicitud->detalles->firstWhere('producto_id', $producto['producto_id']);
            if ($detalle) {
                $detalle->cantidad_aprobada = $producto['cantidad_aprobada'];
                $detalle->save();
            }
        }

        // Orden de entrega primero
        $ordenEntrega = InventarioOrdenEntrega::create([
            'origen_id' => $solicitud->almacen_proveedor_id,
            'destino_id' => $solicitud->almacen_solicitante_id,
            'movimiento_id' => $solicitud->id,
            'tipo_movimiento' => 'solicitud_stock',
            'fecha_envio' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        // Crear detalle por cada producto aprobado

        foreach ($request->productos as $producto) {
            $cantidadEnviada = abs($producto['cantidad_aprobada']);
            if( $cantidadEnviada > 0 ){
                InventarioOrdenEntregaDetalle::create([
                'orden_entrega_id' => $ordenEntrega->id,
                'producto_id' => $producto['producto_id'],
                'cantidad_enviada' => $cantidadEnviada,
            ]);
            }
        
        }

        // Ahora creación de la recepción, vinculando la orden de entrega
        $ordenRecepcion = InventarioRecepcionProducto::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'orden_entrega_id' => $ordenEntrega->id,
            'tipo_recepcion' => 'restribuccion',
            'fecha_recepcion' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        // Crear detalle por cada producto aprobado
        foreach ($request->productos as $producto) {
            $cantidadEnviada = abs($producto['cantidad_aprobada']);
            if( $cantidadEnviada > 0 ){
                InventarioRecepcionProductoDetalle::create([
                'recepcion_id' => $ordenRecepcion->id,
                'producto_id' => $producto['producto_id'],
                'cantidad_esperada' => $cantidadEnviada,
            ]);
            }
        }


        return response()->json([
            'message' => 'Solicitud aceptada y detalles generados.',
            'solicitud_id' => $solicitud->id,
            'success' => true
        ]);
    }



    public function cancelarSolicitud(CancelStockRequest $request)
    {
        $original = InventarioSolicitarStock::with('detalles')->find($request->solicitud_id);

        $original->estado = 'Cancelada';
        $original->motivo = $request->motivo ?? '';
        $original->usuario_actualizacion = Auth::id();
        $original->fecha_actualizacion = now();
        $original->save();

        return response()->json([
            'message' => 'Solicitud cancelada correctamente.',
            'solicitud_id' => $original->id,
            'success' => true
        ]);
    }

    public function solicitudesAceptadas()
    {
        $branchId = Session::get('active_branch_id');
        $almacenId = $branchId; // si el branch representa el almacén actual
        $userId = Auth::id();

        $solicitudes = SolicitudRecibidaStock::with(['almacensolicitante', 'detalles.producto'])
            ->where(function ($query) use ($userId, $almacenId) {
                $query->where(function ($q) use ($userId, $almacenId) {
                    $q->where('estado', 'Pendiente')
                        ->where('almacen_solicitante_id', $almacenId)
                        ->where('usuario_creacion', $userId);
                })
                    ->orWhere(function ($q) use ($userId, $almacenId) {
                        $q->whereIn('estado', ['Aceptada', 'Cancelada'])
                            ->where('almacen_solicitante_id', $almacenId);
                        // quitamos el filtro del usuario_actualizacion
                    });
            })
            ->get();

        return response()->json(SolicitudRecibidaDetalleResource::collection($solicitudes));
    }


    public function stockDisponible($idProducto)
    {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');

        $solicitud = InventarioStock::with(['producto', 'almacen'])
            ->where('producto_id', $idProducto)
            ->where('almacen_id', $almacenId)
            ->get();

        return  response()->json($solicitud);
    }
}
