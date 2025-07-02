<?php

namespace App\QueryBuilders\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;
use App\Models\ControlAcceso\User;

class RoleModuleSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->leftJoin('model_has_module_role', function ($join) {
            $join->on('users.id', '=', 'model_has_module_role.model_id')
                 ->where('model_has_module_role.model_type', '=', User::class);
        })
        ->leftJoin('role_modules', 'model_has_module_role.role_id', '=', 'role_modules.id')
        ->orderBy('role_modules.name', $direction)
        ->select('users.*');
    }
}