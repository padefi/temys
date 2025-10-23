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
        'origen' => $this->origen,
        'destino' => $this->destino,
        'tipoRecepcion' => $this->tipo_recepcion,
        'fechaRecepcion' => $this->fecha_recepcion,
        'estado' => $this->estado,
        'usuarioCreacion' => $this->usuarioCreacion,
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
