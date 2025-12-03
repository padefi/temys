<?php

namespace App\Http\Resources\Contabilidad\PlanCuentas;

use App\Http\Resources\Contabilidad\PlanCuentas\SubcapituloResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CapituloResource extends JsonResource
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
            'codigo' => $this->codigo,
            'descripcion' => $this->descripcion,
            'subcapitulo' => SubcapituloResource::collection($this->whenLoaded('subcapitulo')),
        ];
    }
}
