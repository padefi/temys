<?php

namespace App\Http\Resources\inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlmacenResource extends JsonResource
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
        'nombre' => $this->nombre,
        'tipo' => $this->tipo,
        'responsable_id' => $this->responsable_id,
        'almacen_padre_id' => $this->almacen_padre_id,
    ];
    }
}
