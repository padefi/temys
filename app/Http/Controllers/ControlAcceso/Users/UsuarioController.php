<?php

namespace App\Http\Controllers\ControlAcceso\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\RoleResource;
use App\Http\Resources\ControlAcceso\UserResource;
use App\Models\ControlAcceso\Module;
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
        $roles = Role::where('name', '!=', 'admin')->get();

        return RoleResource::collection($roles);
    }

    public function getRoleModuleByUser(User $user, Module $module)
    {
        $userModuleRole = $user->modulesRole()->where('modules.id', $module->id)->first();
        $roleId = $userModuleRole?->pivot->role_id;

        if (!$roleId)
        {
            return response()->json(['data' => []]);
        }

        $role = Role::find($roleId);

        return new RoleResource($role);
    }
}
