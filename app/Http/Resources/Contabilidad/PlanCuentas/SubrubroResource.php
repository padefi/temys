<?php

namespace App\Http\Resources\Contabilidad\PlanCuentas;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubrubroResource extends JsonResource
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
            'cuenta' => CuentaResource::collection($this->whenLoaded('cuenta')),
        ];
    }
}
