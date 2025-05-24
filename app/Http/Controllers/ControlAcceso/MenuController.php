<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\MenuResource;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::all();

        return Inertia::render('ControlAcceso/Menu/Index', [
            'menus' => MenuResource::collection($menus),
        ]);
    }

    public function showMenus(Module $module)
    {
        return MenuResource::collection($module->menus);
    }

    public function showMenusByUser(User $user, Module $module)
    {
        $userId = $user->id;
        $menus = Menu::leftJoin('module_has_menus', 'menus.id', '=', 'module_has_menus.menu_id')
            ->leftJoin('model_has_menus', function ($join) use ($userId)
            {
                $join->on('menus.id', '=', 'model_has_menus.menu_id')
                    ->where('model_has_menus.model_id', '=', $userId);
            })
            ->where('module_has_menus.module_id', $module->id) // Verifica que el menú pertenece al módulo
            ->select(
                'menus.*',
                DB::raw('IF(model_has_menus.menu_id IS NOT NULL, true, false) as is_assigned') // Verifica si el menú está asignado al usuario
            )
            ->get();

        // Agrega el campo has_menus a cada módulo
        $menus->map(function ($menu)
        {
            $menu->has_submenus = $menu->submenus()->exists();
            return $menu;
        });

        return MenuResource::collection($menus);
    }

    public function managedMenusByUser(Request $request)
    {
        $request->validate([
            'idModule' => ['required', 'exists:modules,id'],
            'idMenu' => ['required', 'exists:menus,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $module = Module::find($request->idModule);
        $menu = Menu::find($request->idMenu);

        if (!$user->modules()->where('modules.id', $module->id)->exists())
        {
            return response()->json(['message' => 'El módulo no está asignado al usuario', 'success' => false]);
        }

        if (!$module->menus()->where('menus.id', $menu->id)->exists())
        {
            return response()->json(['message' => 'El menú no pertenece a dicho módulo', 'success' => false]);
        }

        if ($user->menus()->where('menus.id', $menu->id)->exists())
        {
            $submenuIds = $menu->submenus()->pluck('id');
            $user->menus()->detach($menu->id);
            $user->submenus()->detach($submenuIds);

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->where('menu_id', $menu->id)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->delete();

            return response()->json(['message' => 'Menú eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->menus()->attach($menu->id, ['model_type' => User::class]);

        // Solo asigna permisos si el menú NO tiene submenús
        if ($menu->submenus()->count() === 0)
        {
            $menu->userPermissions()->attach(
                Permission::findByName('read')->id,
                ['model_type' => User::class, 'model_id' => $user->id]
            );
        }

        return response()->json(['message' => 'Menú agregado con exito', 'action' => 'add', 'success' => true]);
    }

    public function getPermissionsMenusByUser(User $user, Menu $menu)
    {
        $permissions = $menu->userPermissions()
            ->select('permissions.name')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)->get();

        return $permissions;
    }

    public function managedPermissionsMenusByUser(Request $request)
    {
        $request->validate([
            'user' => ['required', 'exists:users,id'],
            'idMenu' => ['required', 'exists:menus,id'],
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $user = User::find($request->user);
        $menu = Menu::find($request->idMenu);
        $permission = Permission::findByName($request->permission);

        if (!$user->menus()->where('menus.id', $menu->id)->exists())
        {
            return response()->json(['message' => 'El menú no está asignado al usuario', 'success' => false]);
        }

        $hasPermission = $menu->userPermissions()
            ->where('permissions.id', $permission->id)
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_menu_permissions')
                ->where('menu_id', $menu->id)
                ->where('permission_id', $permission->id)
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $menu->userPermissions()->attach($permission->id, ['model_type' => User::class, 'model_id' => $user->id]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
