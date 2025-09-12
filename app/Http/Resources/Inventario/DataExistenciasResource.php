<?php

namespace App\Http\Resources\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DataExistenciasResource extends JsonResource
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
            'producto_id'=>$this->producto_id,
            'nombre' => $this->nombre,         
            'categoria' => $this->categoria,
            'subCategoria' => $this->subCategoria,
            'stockActual' =>$this->cantidad_actual,
            'entrada'=>$this->total_recibido,
            'salida'=>$this->total_entregado,
            'estadoEntregas'=>$this->estadoEntregas,
            'estado_ajuste'=>$this->estado_ajuste,
            'cantidad_contada'=>$this->cantidad_contada
        ];
    }
}
