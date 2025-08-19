<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\SubmenuResource;
use App\Models\ControlAcceso\Branch;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\Submenu;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class SubmenuController extends Controller
{
    public function index()
    {
        $submenus = Submenu::all();

        return Inertia::render('ControlAcceso/Submenu/Index', [
            'submenus' => SubmenuResource::collection($submenus),
        ]);
    }

    public function showSubmenus(Menu $menu)
    {
        return SubmenuResource::collection($menu->submenus);
    }

    public function showSubmenusByUser(User $user, Branch $branch, Menu $menu)
    {
        $userId = $user->id;
        $submenus = Submenu::leftJoin('menu_has_submenus', 'submenus.id', '=', 'menu_has_submenus.submenu_id')
            ->leftJoin('model_has_submenus', function ($join) use ($user, $branch)
            {
                $join->on('submenus.id', '=', 'model_has_submenus.submenu_id')
                    ->where([
                        ['model_has_submenus.model_id', '=', $user->id],
                        ['model_has_submenus.branch_id', '=', $branch->id]
                    ]);
            })
            ->where('menu_has_submenus.menu_id', $menu->id) // Verifica que el submenú pertenezca al menú
            ->select('submenus.*', DB::raw('(model_has_submenus.submenu_id IS NOT NULL AND model_has_submenus.branch_id IS NOT NULL) as is_assigned')) // Verifica si el submenú está asignado al usuario
            ->orderBy('submenus.name', 'asc')
            ->get();

        return SubmenuResource::collection($submenus);
    }

    public function managedSubmenusByUser(Request $request)
    {
        $request->validate([
            'idBranch' => ['required', 'exists:branches,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'idMenu' => ['required', 'exists:menus,id'],
            'idSubmenu' => ['required', 'exists:submenus,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $module = Module::find($request->idModule);
        $menu = Menu::find($request->idMenu);
        $submenu = Submenu::find($request->idSubmenu);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar modulos a un administrador', 'success' => false]);
        }

        if ($branch->status === 'inactive') {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if (!$user->modules()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'El módulo relacionado con el menú no está asignado al usuario', 'success' => false]);
        }

        if (!$user->menus()->where([['menus.id', $menu->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'El menú no está asignado al usuario', 'success' => false]);
        }

        if (!$menu->submenus()->where('submenus.id', $submenu->id)->exists())
        {
            return response()->json(['message' => 'El submenú no pertenece a dicho menú', 'success' => false]);
        }

        if ($user->submenus()->where([['submenus.id', $submenu->id], ['branch_id', $branch->id]])->exists())
        {
            DB::table('model_has_submenus')
                ->where('model_id', $user->id)
                ->where('submenu_id', $submenu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->where('submenu_id', $submenu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Submenú quitado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->submenus()->attach($submenu->id, ['model_type' => User::class, 'branch_id' => $branch->id]);
        $submenu->userPermissions()->attach(Permission::findByName('read')->id, ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]);

        return response()->json(['message' => 'Submenú agregado con exito', 'action' => 'add', 'success' => true]);
    }

    public function getPermissionsSubmenusByUser(User $user, Branch $branch, Submenu $submenu)
    {
        $permissions = $submenu->userPermissions()
            ->select('permissions.name')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('branch_id', $branch->id)->get();

        return $permissions;
    }

    public function managedPermissionsSubmenusByUser(Request $request)
    {
        $request->validate([
            'user' => ['required', 'exists:users,id'],
            'idBranch' => ['required', 'exists:branches,id'],
            'idSubmenu' => ['required', 'exists:submenus,id'],
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $submenu = Submenu::find($request->idSubmenu);
        $permission = Permission::findByName($request->permission);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar permisos a un administrador', 'success' => false]);
        }

        if ($branch->status === 'inactive') {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if (!$user->submenus()->where([['submenus.id', $submenu->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'El submenú no está asignado al usuario', 'success' => false]);
        }

        $hasPermission = $submenu->userPermissions()
            ->where('permissions.id', $permission->id)
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('branch_id', $branch->id)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_submenu_permissions')
                ->where('submenu_id', $submenu->id)
                ->where('permission_id', $permission->id)
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $submenu->userPermissions()->attach($permission->id, ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
