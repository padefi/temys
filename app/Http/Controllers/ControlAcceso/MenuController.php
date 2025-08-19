<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\MenuResource;
use App\Models\ControlAcceso\Branch;
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

    public function showMenusByUser(User $user, Branch $branch, Module $module)
    {
        $menus = Menu::leftJoin('module_has_menus', 'menus.id', '=', 'module_has_menus.menu_id')
            ->leftJoin('model_has_menus', function ($join) use ($user, $branch)
            {
                $join->on('menus.id', '=', 'model_has_menus.menu_id')
                    ->where([
                        ['model_has_menus.model_id', '=', $user->id],
                        ['model_has_menus.branch_id', '=', $branch->id]
                    ]);
            })
            ->where('module_has_menus.module_id', $module->id) // Verifica que el menú pertenezca al módulo
            ->select('menus.*', DB::raw('(model_has_menus.menu_id IS NOT NULL AND model_has_menus.branch_id IS NOT NULL) as is_assigned')) // Verifica si el menú está asignado al usuario
            ->orderBy('menus.name', 'asc')
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
            'idBranch' => ['required', 'exists:branches,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'idMenu' => ['required', 'exists:menus,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $module = Module::find($request->idModule);
        $menu = Menu::find($request->idMenu);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar modulos a un administrador', 'success' => false]);
        }

        if ($branch->status === 'inactive')
        {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if (!$user->modules()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'El módulo no ha sido asignado al usuario', 'success' => false]);
        }

        if (!$user->modulesRole()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'No ha sido asignado el rol del usuario al módulo', 'success' => false]);
        }

        if (!$module->menus()->where('menus.id', $menu->id)->exists())
        {
            return response()->json(['message' => 'El menú no pertenece a dicho módulo', 'success' => false]);
        }

        if ($user->menus()->where([['menus.id', $menu->id], ['branch_id', $branch->id]])->exists())
        {
            $submenuIds = $menu->submenus()->pluck('id');

            DB::table('model_has_menus')
                ->where('model_id', $user->id)
                ->where('menu_id', $menu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenus')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->where('menu_id', $menu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Menú quitado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->menus()->attach($request->idMenu, [
            'model_type' => User::class,
            'branch_id' => $branch->id
        ]);

        // Solo asigna permisos si el menú NO tiene submenús
        if ($menu->submenus()->count() === 0)
        {
            $menu->userPermissions()->attach(
                Permission::findByName('read')->id,
                ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]
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
            'idBranch' => ['required', 'exists:branches,id'],
            'idMenu' => ['required', 'exists:menus,id'],
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $menu = Menu::find($request->idMenu);
        $permission = Permission::findByName($request->permission);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar permisos a un administrador', 'success' => false]);
        }

        if ($branch->status === 'inactive')
        {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if (!$user->menus()->where('menus.id', $menu->id)->exists())
        {
            return response()->json(['message' => 'El menú no ha sido asignado al usuario', 'success' => false]);
        }

        $hasPermission = $menu->userPermissions()
            ->where('permissions.id', $permission->id)
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('branch_id', $branch->id)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_menu_permissions')
                ->where('menu_id', $menu->id)
                ->where('permission_id', $permission->id)
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $menu->userPermissions()->attach($permission->id, ['model_type' => User::class, 'model_id' => $user->id]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
