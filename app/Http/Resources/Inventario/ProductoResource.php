<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
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
        'descripcion' => $this->descripcion,
        'modelo_id' => $this->modelo_id,
        'subcategoria_id' => $this->subcategoria_id,
    ];
    }
}
