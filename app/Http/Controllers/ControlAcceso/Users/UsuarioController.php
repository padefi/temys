<?php

namespace App\Http\Controllers\ControlAcceso\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Http\Resources\ControlAcceso\RoleResource;
use App\Http\Resources\ControlAcceso\UserResource;
use App\Http\Resources\UserModulePanel\RoleModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('ControlAcceso/Usuarios/UsuariosPage', [
            'users' => UserResource::collection($users),
        ]);
    }

    public function getRoles()
    {
        $roles = Role::all();

        return RoleResource::collection($roles);
    }

    public function getModuleRoles()
    {
        $moduleRoles = RoleModule::all();

        return RoleModuleResource::collection($moduleRoles);
    }

    public function getRoleModuleByUser(User $user, Module $module)
    {
        $userModuleRole = $user->modulesRole()->where('modules.id', $module->id)->first();
        $roleId = $userModuleRole?->pivot->role_id;

        if (!$roleId)
        {
            return response()->json(['data' => []]);
        }

        $role = RoleModule::find($roleId);

        return new RoleResource($role);
    }
}
