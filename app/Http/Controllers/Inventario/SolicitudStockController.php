<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AcceptStockRequest;
use App\Http\Requests\Inventario\CancelStockRequest;
use App\Http\Requests\Inventario\OrderStockRequest;
use App\Http\Requests\Inventario\SolicitarStockRequest;
use App\Http\Resources\inventario\SolicitudRecibidaStockResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioOrdenEntregaDetalle;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioSolicitarStock;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\SolicitudRecibidaStock;
use Illuminate\Support\Facades\Auth;


class SolicitudStockController extends Controller
{

    public function solicitarStockMultiple(SolicitarStockRequest $request)
    {
        $validated = $request->validated();

        try {
            foreach ($validated['solicitudes'] as $solicitud) {
                InventarioSolicitarStock::create([
                    'producto_id' => $solicitud['producto_id'],
                    'almacen_solicitante_id' => $solicitud['almacen_solicitante_id'],
                    'almacen_proveedor_id' => $solicitud['almacen_proveedor_id'],
                    'cantidad' => $solicitud['cantidad'],
                    'prioridad' => $solicitud['prioridad'],
                    'estado' => 'Pendiente',
                    'motivo' => $solicitud['motivo'] ?? null,
                    'fecha_creacion' => now(),
                    'usuario_creacion' => Auth::id(),
                ]);
            }

            return response()->json(['message' => 'Solicitudes creadas correctamente'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al procesar solicitudes', 'details' => $e->getMessage()], 500);
        }
    }


    public function solicitarStock(OrderStockRequest $request)
    {

        $validated = $request->validated();

        InventarioSolicitarStock::create([
            'producto_id' => $validated['producto_id'],
            'almacen_solicitante_id' => $validated['almacen_solicitante_id'],
            'almacen_proveedor_id' => $validated['almacen_proveedor_id'],
            'cantidad' => $validated['cantidad'],
            'prioridad' => $validated['prioridad'],
            'estado' => 'Pendiente',
            'motivo' => $validated['motivo'] ?? null,
            'fecha_creacion' => now(),
            'usuario_creacion' => Auth::id(),
        ]);
    }

    public function getSolicitudesAll()
    {
        $solicitudes = SolicitudRecibidaStock::with(['producto', 'almacensolicitante'])
            ->where('almacen_proveedor_id', Auth::id())
            ->where('estado', 'Pendiente')
            ->get();
        return response()->json(SolicitudRecibidaStockResource::collection($solicitudes));
    }

    public function getSolicitudDetalle($id)
    {
        $solicitud = InventarioSolicitarStock::with([
            'producto',
            'almacensolicitante',
            'almacenProovedor'
        ])->find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        return response()->json(new SolicitudRecibidaStockResource($solicitud));
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

        $solicitud = InventarioSolicitarStock::findOrFail($request->solicitud_id);

        $solicitud->estado = 'Aceptada';
        $solicitud->cantidad_aprobada = $request->cantidad;
        $solicitud->motivo = $request->motivo ?? '';
        $solicitud->usuario_actualizacion = Auth::id();
        $solicitud->fecha_actualizacion = now();
        $solicitud->save();


        // Recepción
        InventarioRecepcionProducto::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'solicitud_id' => $solicitud->id,
            'tipo_movimiento' => 'restribuccion',
            'fecha_recepcion' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        // Orden de entrega
        $ordenEntrega = InventarioOrdenEntrega::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'solicitud_id' => $solicitud->id,
            'fecha_envio' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);


        /*  InventarioRecepcionProducto::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'tipo_movimiento' => 'restribuccion',
            'fecha_recepcion' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        $ordenEntrega = InventarioOrdenEntrega::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'fecha_envio' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]); */

        InventarioOrdenEntregaDetalle::create([
            'orden_entrega_id' => $ordenEntrega->id,
            'producto_id' => $solicitud->producto_id,
            'cantidad_enviada' => -abs($solicitud->cantidad),

        ]);


        return response()->json([
            'message' => 'Nueva solicitud creada con almacenes invertidos.',
            'nueva_solicitud_id' => $solicitud->id,
        ]);
    }

    public function cancelarSolicitud(CancelStockRequest $request)
    {
        $original = InventarioSolicitarStock::find($request->solicitud_id);
        $original->estado = 'Cancelada';
        $original->save();
        $nuevaSolicitud = $original->replicate(); 


        // Sobrescribir los campos con los valores del request
        $nuevaSolicitud->estado = $request->estado;
        $nuevaSolicitud->motivo = $request->motivo ?? '';
        $nuevaSolicitud->fecha_creacion = now();
        $nuevaSolicitud->usuario_creacion = Auth::id();
        $nuevaSolicitud->save();

        return response()->json([
            'message' => 'Nueva solicitud creada con almacenes invertidos.',
            'nueva_solicitud_id' => $nuevaSolicitud->id,
        ]);
    }


    public function solicitudesAceptadas()
    {
        $userId = Auth::id();

        $solicitudes = SolicitudRecibidaStock::with(['producto', 'almacensolicitante'])
            ->where(function ($query) use ($userId) {             
                $query->where('estado', 'Pendiente')
                    ->where('usuario_creacion', $userId);
            })
            ->orWhere(function ($query) use ($userId) {
                // Aceptadas o Canceladas por otros
                $query->whereIn('estado', ['Aceptada', 'Cancelada'])
                    ->whereColumn('almacen_solicitante_id', '!=', 'usuario_actualizacion')
                    ->where('usuario_actualizacion', '!=', $userId);
            })
            ->get();

        return response()->json(SolicitudRecibidaStockResource::collection($solicitudes));
    }

    public function stockDisponible($idProducto){
        $userId = Auth::id();
        $solicitud=InventarioStock::with(['producto', 'almacen'])
        -> where ('producto_id',$idProducto)
        ->where('almacen_id',$userId)
        ->get();

        return  response()->json($solicitud);

    }
}
