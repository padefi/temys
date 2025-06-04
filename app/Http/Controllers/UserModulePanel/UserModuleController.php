<?php

namespace App\Http\Controllers\UserModulePanel;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Http\Resources\UserModulePanel\RoleModuleResource;
use App\Http\Resources\UserModulePanel\UserModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserModuleController extends Controller
{
    public function index(Request $request)
    {
        $modulo = $request->segment(1); // extrae el nombre del módulo de la URL
        $module = Module::where('name', $modulo)->first();
        $users = User::moduleUsers($module);

        $users = $users->map(function ($user) use ($module)
        {
            $pivot = $user->modulesRole()->where('modules.id', $module->id)->first();
            $roleId = $pivot ? $pivot->pivot->role_id : null;
            $user->module_role = $roleId ? RoleModule::findById($roleId)->name : null;
            return $user;
        });

        return Inertia::render('UserModulePanel/UsuariosPage', [
            'users' => UserModuleResource::collection($users),
            'module' => $module->id,
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
            return $module;
        });

        return ModuleResource::collection($modules);
    }
}
