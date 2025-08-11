<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AcceptStockRequest;
use App\Http\Requests\Inventario\CancelStockRequest;
use App\Http\Requests\Inventario\OrderStockRequest;
use App\Http\Requests\Inventario\SolicitarStockRequest;
use App\Http\Resources\Inventario\SolicitudRecibidaDetalleResource;
use App\Http\Resources\inventario\SolicitudRecibidaStockResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioOrdenEntregaDetalle;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioSolicitarDetalle;
use App\Models\Inventario\InventarioSolicitarStock;
use App\Models\Inventario\InventarioSolicitudDetalle;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\SolicitudRecibidaStock;
use Illuminate\Support\Facades\Auth;


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
                'solicitud_id' => $solicitud->id
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al procesar la solicitud.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getSolicitudesAll()
    {
        $solicitudes = InventarioSolicitarStock::with([
            'almacensolicitante' 
        ])
            ->where('almacen_proveedor_id', Auth::id())
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

        // Recepción
        InventarioRecepcionProducto::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'movimiento_id' => $solicitud->id,
            'tipo_movimiento' => 'restribuccion',
            'fecha_recepcion' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        // Orden de entrega
        $ordenEntrega = InventarioOrdenEntrega::create([
            'origen_id' => $solicitud->almacen_solicitante_id,
            'destino_id' => $solicitud->almacen_proveedor_id,
            'movimiento_id' => $solicitud->id,
            'tipo_movimiento' => 'solicitud_stock',
            'fecha_envio' => now(),
            'estado' => 'Pendiente',
            'usuario_creacion' => Auth::id(),
        ]);

        // Crear detalle por cada producto aprobado
        foreach ($request->productos as $producto) {
            InventarioOrdenEntregaDetalle::create([
                'orden_entrega_id' => $ordenEntrega->id,
                'producto_id' => $producto['producto_id'],
                'cantidad_enviada' => -abs($producto['cantidad_aprobada']),
            ]);
        }

        return response()->json([
            'message' => 'Solicitud aceptada y detalles generados.',
            'solicitud_id' => $solicitud->id,
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
        ]);
    }


    public function solicitudesAceptadas()
    {
        $userId = Auth::id();

        $solicitudes = SolicitudRecibidaStock::with(['almacensolicitante','detalles.producto'])
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

        return response()->json(SolicitudRecibidaDetalleResource::collection($solicitudes));
    }

    public function stockDisponible($idProducto)
    {
        $userId = Auth::id();
        $solicitud = InventarioStock::with(['producto', 'almacen'])
            ->where('producto_id', $idProducto)
            ->where('almacen_id', $userId)
            ->get();

        return  response()->json($solicitud);
    }
}
