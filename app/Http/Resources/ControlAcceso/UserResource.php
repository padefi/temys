<?php

namespace App\Http\Resources\ControlAcceso;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Permission\Contracts\Role;

class UserResource extends JsonResource
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
            'is_active' => $this->is_active,
            'roles' => RoleResource::collection($this->roles),
            'modules' => ModuleResource::collection($this->modules),
            'menus' => MenuResource::collection($this->menus),
            'submenus' => SubmenuResource::collection($this->submenus),
            'permissions' => $this->permissions,
        ];
    }
}
