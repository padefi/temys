<?php

namespace App\Http\Resources\UserModulePanel;

use App\Http\Resources\ControlAcceso\RoleResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserModuleResource extends JsonResource
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
            'last_name' => $this->last_name,
            'email' => $this->email,
            'module_roles' => $this->module_roles ? RoleResource::collection($this->module_roles) : [],
            'role_module' => $this->when(isset($this->role_module), $this->role_module),
        ];
    }
}
