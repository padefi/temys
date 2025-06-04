<?php

namespace App\Http\Resources\UserModulePanel;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleModuleResource extends JsonResource
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
        ];
    }
}
