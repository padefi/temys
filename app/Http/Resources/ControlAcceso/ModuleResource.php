<?php

namespace App\Http\Resources\ControlAcceso;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
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
            'name' => $this->name,
            'key' => $this->key,
            'menus' => MenuResource::collection($this->whenLoaded('menus')),
            'is_assigned' => $this->when(isset($this->is_assigned), $this->is_assigned),
            'has_menus' => $this->when(isset($this->has_menus), $this->has_menus),
            'has_role_module' => $this->when(isset($this->has_role_module), $this->has_role_module),
        ];
    }
}
