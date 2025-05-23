<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PhpParser\Node\Expr\AssignOp\Mod;
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
            $user->modules()->detach($module->id);
            DB::table('model_has_menus')->where('model_id', $user->id)
                ->whereIn('menu_id', $module->menus()->pluck('id'))->delete();
            DB::table('model_has_submenus')->where('model_id', $user->id)
                ->whereIn('submenu_id', function ($query) use ($module)
                {
                    $query->select('submenus.id')
                        ->from('submenus')
                        ->join('menu_has_submenus', 'submenus.id', '=', 'menu_has_submenus.submenu_id')
                        ->join('module_has_menus', 'menu_has_submenus.menu_id', '=', 'module_has_menus.menu_id')
                        ->where('module_has_menus.module_id', $module->id);
                })->delete();

            return response()->json(['message' => 'Modulo eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->modules()->attach($module->id, ['model_type' => User::class]);

        return response()->json(['message' => 'Modulo agregado con exito', 'action' => 'add', 'success' => true]);
    }

    public function getPermissionsModulesByUser(User $user, Module $module)
    {

        $permissions = DB::table('model_has_module_permissions')
            ->join('permissions', 'model_has_module_permissions.permission_id', '=', 'permissions.id')
            ->select('permissions.name')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('module_id', $module->id)
            ->get();

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

        $hasPermission = DB::table('model_has_module_permissions')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('module_id', $module->id)
            ->where('permission_id', $permission->id)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_module_permissions')
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->where('module_id', $module->id)
                ->where('permission_id', $permission->id)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        DB::table('model_has_module_permissions')->insert([
            'model_id' => $user->id,
            'model_type' => User::class,
            'module_id' => $module->id,
            'permission_id' => $permission->id,
        ]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
