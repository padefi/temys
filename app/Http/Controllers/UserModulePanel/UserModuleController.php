<?php

namespace App\Http\Controllers\UserModulePanel;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Http\Resources\UserModulePanel\RoleModuleResource;
use App\Http\Resources\UserModulePanel\UserModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
use App\Models\ControlAcceso\User;
use App\QueryBuilders\Sorts\RoleModuleSort;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class UserModuleController extends Controller
{
    public function index(Request $request)
    {
        $modulo = $request->segment(1); // extrae el nombre del módulo de la URL
        $module = Module::where('name', $modulo)->firstOrFail();

        $baseQuery = User::query()
            ->select(['users.id', 'users.name', 'users.last_name', 'users.email', 'users.is_active', 'users.reset_password'])
            ->whereHas('modules', function ($query) use ($module)
            {
                $query->where('modules.id', $module->id);
            })
            ->whereHas('userRoles', function ($query)
            {
                $query->where('name', '!=', 'admin');
            })
            ->with(['modulesRole' => function ($query) use ($module)
            {
                $query->where('modules.id', $module->id);
            }]);

        $users = QueryBuilder::for($baseQuery)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('last_name'),
                AllowedFilter::partial('email'),
                AllowedFilter::callback('module_roles', function ($query, $value) use ($module)
                {
                    if ($value === '__NO_ROLE__')
                    {
                        $query->doesntHave('modulesRole');
                    }
                    else if (!empty($value))
                    {
                        $query->whereHas('modulesRole', function ($q) use ($value, $module)
                        {
                            $q->where('modules.id', $module->id)
                                ->where('model_has_module_role.role_id', RoleModule::where('name', $value)->first()->id);
                        });
                    }
                }),
            ])
            ->allowedSorts([
                'name',
                'last_name',
                'email',
                AllowedSort::custom('module_roles', new RoleModuleSort())->defaultDirection('desc'),
            ])
            ->defaultSort('id')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $users->getCollection()->transform(function ($user)
        {
            $roleIds = $user->modulesRole->pluck('pivot.role_id')->filter();
            $user->module_roles = RoleModule::whereIn('id', $roleIds)->get();
            return $user;
        });

        $roles = Cache::remember('module_roles_list', 3600, function ()
        {
            return RoleModule::select(['id', 'name'])->get();
        });

        $activeFilters = $request->input('filter', []);
        return Inertia::render('UserModulePanel/page', [
            'users' => UserModuleResource::collection($users),
            'module' => $module->id,
            'module_roles' => RoleModuleResource::collection($roles),
            'filters' => $activeFilters,
        ]);
    }

    public function getModuleRoles()
    {
        $moduleRoles = RoleModule::all();
        return RoleModuleResource::collection($moduleRoles);
    }

    public function showModuleByUser(User $user, Module $module)
    {
        $modules = Module::where('modules.id', $module->id)
            ->leftJoin('model_has_modules', function ($join) use ($user)
            {
                $join->on('modules.id', '=', 'model_has_modules.module_id')
                    ->where('model_has_modules.model_id', '=', $user->id);
            })
            ->join('role_has_modules', 'modules.id', '=', 'role_has_modules.module_id')
            ->where('role_has_modules.role_id', $user->userRoles()->pluck('role_id')->first())
            ->select('modules.*', DB::raw('IF(model_has_modules.module_id IS NOT NULL, true, false) as is_assigned')) // Verifica si el módulo estaba asignado al usuario
            ->orderBy('modules.name', 'asc')
            ->get();

        // Agrega el campo has_menus a cada módulo
        $modules->map(function ($module) use ($user)
        {
            $module->has_menus = $module->menus()->exists();
            $module->has_role_module = $user->modulesRole()->where('modules.id', $module->id)->exists();

            $roleModuleId = $user->modulesRole()->where('modules.id', $module->id)->pluck('role_id')->first();
            $module->role_module = $roleModuleId ? RoleModule::findById($roleModuleId)?->name : null;
            return $module;
        });

        return ModuleResource::collection($modules);
    }
}
