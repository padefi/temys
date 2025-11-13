<?php

namespace App\Http\Resources\Contabilidad\Asientos;

use App\Http\Resources\Contabilidad\EjercicioResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AsientoResource extends JsonResource
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
            'ejercicio' => $this->ejercicio->descripcion,
            'numero' => $this->numero,
            'estado' => $this->estado,
            'fecha' => $this->fecha,            
            'concepto' => $this->concepto,            
            'importe' => $this->importe,            
            'partidas' => PartidaResource::collection($this->whenLoaded('partidas')),
        ];
    }
}
