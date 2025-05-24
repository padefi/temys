<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::all();

        return Inertia::render('ControlAcceso/Module/Index', [
            'modules' => ModuleResource::collection($modules),
        ]);
    }

    public function showModules()
    {
        $modules = Module::all();

        return ModuleResource::collection($modules);
    }

    public function showModulesByUser(User $user)
    {
        $modules = Module::leftJoin('model_has_modules', function ($join) use ($user)
        {
            $join->on('modules.id', '=', 'model_has_modules.module_id')
                ->where('model_has_modules.model_id', '=', $user->id);
        })
            ->select('modules.*', DB::raw('IF(model_has_modules.module_id IS NOT NULL, true, false) as is_assigned')) // Verifica si el módulo estaba asignado al usuario
            ->get();

        // Agrega el campo has_menus a cada módulo
        $modules->map(function ($module)
        {
            $module->has_menus = $module->menus()->exists();
            return $module;
        });

        return ModuleResource::collection($modules);
    }

    public function managedModulesByUser(Request $request)
    {
        $request->validate([
            'idModule' => ['required', 'exists:modules,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $module = Module::find($request->idModule);

        if ($user->modules()->where('modules.id', $module->id)->exists())
        {
            $menuIds = $module->menus()->pluck('id');
            $menus = Menu::whereIn('id', $menuIds)->get();
            $submenuIds = $menus->pluck('submenus')->flatten()->pluck('id');

            $user->modules()->detach($module->id);
            $user->menus()->detach($menuIds);
            $user->submenus()->detach($submenuIds);

            DB::table('model_has_module_permissions')
                ->where('model_id', $user->id)
                ->where('module_id', $module->id)
                ->delete();

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('menu_id', $menuIds)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->delete();

            return response()->json(['message' => 'Modulo eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->modules()->attach($request->idModule, ['model_type' => User::class]);

        // Solo asigna permisos si el módulo NO tiene menús
        if ($module->menus()->count() === 0)
        {
            $module->userPermissions()->attach(
                Permission::findByName('read')->id,
                ['model_type' => User::class, 'model_id' => $user->id]
            );
        }

        return response()->json(['message' => 'Modulo agregado con exito', 'action' => 'add', 'success' => true]);
    }

    public function getPermissionsModulesByUser(User $user, Module $module)
    {
        $permissions = $module->userPermissions()
            ->select('permissions.name')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)->get();

        return $permissions;
    }

    public function managedPermissionsModulesByUser(Request $request)
    {
        $request->validate([
            'user' => ['required', 'exists:users,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $user = User::find($request->user);
        $module = Module::find($request->idModule);
        $permission = Permission::findByName($request->permission);

        if (!$user->modules()->where('modules.id', $module->id)->exists())
        {
            return response()->json(['message' => 'El módulo no está asignado al usuario', 'success' => false]);
        }

        $hasPermission = $module->userPermissions()
            ->where('permissions.id', $permission->id)
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_module_permissions')
                ->where('module_id', $module->id)
                ->where('permission_id', $permission->id)
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $module->userPermissions()->attach($permission->id, ['model_type' => User::class, 'model_id' => $user->id]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
