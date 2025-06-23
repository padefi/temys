<?php

namespace App\QueryBuilders\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;
use App\Models\ControlAcceso\User;

class RoleSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->leftJoin('model_has_roles', function ($join) {
            $join->on('users.id', '=', 'model_has_roles.model_id')
                 ->where('model_has_roles.model_type', '=', User::class);
        })
        ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
        ->orderBy('roles.name', $direction)
        ->select('users.*');
    }
}