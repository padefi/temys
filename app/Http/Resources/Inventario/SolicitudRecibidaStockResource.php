<?php

namespace App\Http\Resources\inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitudRecibidaStockResource extends JsonResource
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
        'nombre_producto' => optional($this->producto)->nombre,
        'nombre_almacen' => optional($this->almacensolicitante)->nombre,
        'prioridad' => $this->prioridad,
        'fecha' => $this->fecha_creacion,
    ];
}

}
