<?php

namespace App\QueryBuilders\Filters;

use App\Models\ControlAcceso\RoleModule;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class RolesFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        if ($value === '__NO_ROLE__')
        {
            $query->doesntHave('roles');
        }
        else if (!empty($value))
        {
            $query->whereHas('roles', function ($q) use ($value)
            {
                $q->where('name', $value);
            });
        }
    }
}
