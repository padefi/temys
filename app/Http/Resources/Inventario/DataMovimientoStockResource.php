<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DataMovimientoStockResource extends JsonResource
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
            'fecha'=>$this->fecha_creacion,
            'tipo_movimiento' => $this->tipo_movimiento,         
            'nombreProducto' => $this->nombreProducto,
            'origen' => $this->origen,
            'destino' =>$this->destino,
            'usuarioCreacion'=>$this->usuarioCreacion,
            'cantidad'=>$this->cantidad,            
        ];
    }
}
