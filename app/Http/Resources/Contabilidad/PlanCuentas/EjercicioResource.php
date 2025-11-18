<?php

namespace App\Http\Resources\Contabilidad;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EjercicioResource extends JsonResource
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
            'descripcion' => $this->descripcion,
            'fecha_inicio' => $this->fecha_inicio,
            'fecha_fin' => $this->fecha_fin,
            'estado' => $this->estado,
            'capitulo' => EjercicioResource::collection($this->whenLoaded('capitulo')),
        ];
    }
}
