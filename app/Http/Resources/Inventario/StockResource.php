<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
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
            'cantidad_actual' => $this->cantidad_actual,
            'cantidad_contada' => $this->cantidad_contada,
            'estado_ajuste'=>$this->estado_ajuste,
            'stock_minimo' => $this->stock_minimo,
            'producto' => new ProductoResource($this->whenLoaded('producto')),
            'almacen' => new AlmacenResource($this->whenLoaded('almacen')),
        ];
    }
}
