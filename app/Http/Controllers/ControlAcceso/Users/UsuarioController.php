<?php

namespace App\Http\Controllers\ControlAcceso\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\ControlAcceso\Users\UserRequest;
use App\Http\Resources\ControlAcceso\RoleResource;
use App\Http\Resources\ControlAcceso\UserResource;
use App\Http\Resources\UserModulePanel\RoleModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index()
    {
        $users = User::all();
        $roles = Role::all();
        $roles->prepend(new Role(['id' => 0, 'name' => 'SIN ROL']));

        return Inertia::render('ControlAcceso/Usuarios/UsuariosPage', [
            'users' => UserResource::collection($users),
            'roles' => RoleResource::collection($roles),
        ]);
    }

    public function update(UserRequest $request, User $user)
    {
        if (!$user->is_active) return response()->json(['message' => 'El usuario se encuentra deshabilitado', 'success' => false]);

        $user->update($request->all());
        $user->update(['updated_at' => now()]);
        $user->syncRoles($request->role);

        return response()->json(['message' => 'Usuario actualizado con exito', 'success' => true]);
    }

    public function resetPassword(User $user)
    {
        if (!$user->is_active) return response()->json(['message' => 'El usuario se encuentra deshabilitado', 'success' => false]);

        $user->update([
            'password' => Hash::make('12345678'),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Contraseña restablecida con exito', 'success' => true]);
    }

    public function manageActive(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active,
            'updated_at' => now()
        ]);

        $message = 'Usuario habilitado con exito';

        if (!$user->is_active)
        {
            $user->syncRoles([]);
            $message = 'Usuario deshabilitado con exito';
        }

        return response()->json(['message' => $message, 'action' => !$user->is_active, 'success' => true]);
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
