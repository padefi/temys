<?php

namespace App\QueryBuilders\Filters;

use App\Models\ControlAcceso\RoleModule;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class RoleModuleFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        if ($value === '__NO_ROLE__') {
            $query->doesntHave('modulesRole');
        } else if (!empty($value)) {
            $roleModule = RoleModule::where('name', $value)->first();
            if ($roleModule) {
                $query->whereHas('modulesRole', function ($q) use ($roleModule) {
                    $q->where('model_has_module_role.role_id', $roleModule->id);
                });
            }
        }
    }
}