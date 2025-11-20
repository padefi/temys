<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Models\Inventario\InventarioTracking;
use Illuminate\Http\Request;

class SeguimientoController extends Controller
{
    public function index(Request $request)
    {
        $movimientoId = $request->input('orden_id');

        if (!$movimientoId) {
            return response()->json([
                'error' => 'Debe proporcionar el ID del movimiento.'
            ], 400);
        }

        $transito = InventarioTracking::with([
            'ordenEntrega.origen:id,nombre',
            'ordenEntrega.destino:id,nombre',
            'movimientoEstados',
            'ordenEntrega.detalles.producto'
        ])
        ->where('entrega_id', $movimientoId)
        ->get();

        if ($transito->isEmpty()) {
            return response()->json([
                'mensaje' => 'No se encontraron registros para este movimiento.'
            ], 404);
        }


        $transito->each(function ($item) {
           
            $item->cantidad_total = $item->ordenEntrega->detalles->sum('cantidad_enviada');
            
        });

        return response()->json($transito);
    }
}
