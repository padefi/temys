<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\SolicitudRecibidaStockResource;
use App\Models\Inventario\InventarioSolicitarStock;
use App\Models\Inventario\SolicitudRecibidaStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SolicitudStockController extends Controller
{

    public function solicitarStock(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_solicitante_id' => 'required|exists:almacenes,id',
            'almacen_proovedor_id' => 'required|exists:almacenes,id',
            'cantidad' => 'required|integer|min:1',
            'prioridad' => 'required|string|max:50',
            'motivo' => 'nullable|string|max:255',
        ]);
        InventarioSolicitarStock::create([
            'producto_id' => $validated['producto_id'],
            'almacen_solicitante_id' => $validated['almacen_solicitante_id'],
            'almacen_proovedor_id' => $validated['almacen_proovedor_id'],
            'cantidad' => $validated['cantidad'],
            'prioridad' => $validated['prioridad'],
            'estado' => 'Pendiente',
            'motivo' => $validated['motivo'] ?? null,
            'fecha_creacion' => now(),
            'usuario_creacion' => Auth::user()->id,
        ]);
    }

    public function getSolicitudesAll()
    {
        $solicitudes = SolicitudRecibidaStock::with(['producto', 'almacensolicitante'])
            ->where('almacen_proovedor_id', Auth::user()->id)
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

    public function aceptarSolicitud(Request $request)
    {
        $request->validate([
            'solicitud_id' => 'required|exists:inventario_solicitar_stocks,id',
            'estado' => 'required|in:Pendiente,Aceptada,Cancelada',
            'motivo' => 'nullable|string',
            'cantidad' => 'required|numeric|min:1',
        ]);

        $original = InventarioSolicitarStock::find($request->solicitud_id);
        $original->estado = 'Aceptada';
        $original->save();
        $nuevaSolicitud = $original->replicate(); // compia el registro


        // Sobrescribir los campos con los valores del request
        $nuevaSolicitud->estado = $request->estado;
        $nuevaSolicitud->motivo = $request->motivo ?? '';
        $nuevaSolicitud->cantidad = $request->cantidad;
        $nuevaSolicitud->fecha_creacion = now();
        $nuevaSolicitud->usuario_creacion = Auth::user()->id; 

        $nuevaSolicitud->save();

        return response()->json([
            'message' => 'Nueva solicitud creada con almacenes invertidos.',
            'nueva_solicitud_id' => $nuevaSolicitud->id,
        ]);
    }

        public function cancelarSolicitud(Request $request)
    {
        $request->validate([
            'solicitud_id' => 'required|exists:inventario_solicitar_stocks,id',
            'estado' => 'required|in:Pendiente,Aceptada,Cancelada',
            'motivo' => 'nullable|string',
        ]);

        $original = InventarioSolicitarStock::find($request->solicitud_id);
        $original->estado = 'Cancelada';
        $original->save();
        $nuevaSolicitud = $original->replicate(); // compia el registro


        // Sobrescribir los campos con los valores del request
        $nuevaSolicitud->estado = $request->estado;
        $nuevaSolicitud->motivo = $request->motivo ?? '';
        $nuevaSolicitud->fecha_creacion = now();
        $nuevaSolicitud->usuario_creacion = Auth::user()->id; 

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
        ->where('almacen_solicitante_id', $userId)
        ->where(function ($query) use ($userId) {
            $query->where('almacen_proovedor_id', '!=', $userId)
                  ->where('usuario_creacion', $userId);
        })
        ->whereIn('estado', ['Aceptada', 'Cancelada', 'Pendiente'])
        ->get();

    return response()->json(SolicitudRecibidaStockResource::collection($solicitudes));
}




}
