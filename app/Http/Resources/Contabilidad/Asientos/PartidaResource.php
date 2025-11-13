<?php

namespace App\Http\Resources\Contabilidad\Asientos;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartidaResource extends JsonResource
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
            'cuenta' => $this->cuenta,
            'concepto' => $this->concepto,
            'debe' => $this->debe,
            'haber' => $this->haber,
        ];
    }
}
