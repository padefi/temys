<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecepcionesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'orden_id'=>$this->orden_entrega_id,
        'origen' => $this->origen,
        'destino' => $this->destino,
        'tipo_recepcion' => $this->tipo_recepcion,
        'fecha_recepcion' => $this->fecha_recepcion,
        'estado' => $this->estado,
        'usuarioCreacion' => $this->usuarioCreacion,
        'estado_orden_entrega' => $this->estado_orden_entrega,
        'detalles' => $this->detalles->map(function ($detalle) {
            return [
                'id' => $detalle->id,
                'producto_id' => $detalle->producto_id,
                'nombreProducto' => $detalle->producto->nombre ?? null,
                'cantidadRecibida' => $detalle->cantidad_recibida,
                'cantidadEsperada' => $detalle->cantidad_esperada,
                'estado' => $detalle->estado,
            ];
        }),
    ];
}

}
