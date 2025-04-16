<?php

namespace App\Http\Resources\ControlAcceso;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'key' => $this->key,
        ];
    }
}
