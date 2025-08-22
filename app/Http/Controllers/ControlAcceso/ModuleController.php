<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Branch;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
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

    public function showModulesByUser(User $user, Branch $branch)
    {
        $modules = Module::leftJoin('model_has_modules', function ($join) use ($user, $branch)
        {
            $join->on('modules.id', '=', 'model_has_modules.module_id')
                ->where([
                    ['model_has_modules.model_id', '=', $user->id],
                    ['model_has_modules.branch_id', '=', $branch->id]
                ]);
        })
            ->join('role_has_modules', 'modules.id', '=', 'role_has_modules.module_id')
            ->where('role_has_modules.role_id', $user->userRoles()->pluck('role_id')->first())
            ->select('modules.*', DB::raw('(model_has_modules.module_id IS NOT NULL AND model_has_modules.branch_id IS NOT NULL) as is_assigned')) // Verifica si el módulo está asignado al usuario
            ->orderBy('modules.name', 'asc')
            ->get();

        // Agrega el campo has_menus a cada módulo
        $modules->map(function ($module) use ($user, $branch)
        {
            $module->has_menus = $module->menus()->exists();
            $module->has_role_module = $user->modulesRole()->where([
                ['modules.id', '=', $module->id],
                ['branch_id', '=', $branch->id],
            ])->exists();

            $roleModuleId = $user->modulesRole()->where([
                ['modules.id', '=', $module->id],
                ['branch_id', '=', $branch->id],
            ])->pluck('role_id')->first();
            $module->role_module = $roleModuleId ? RoleModule::findById($roleModuleId)?->name : null;
            return $module;
        });

        return ModuleResource::collection($modules);
    }

    public function managedRoleModulesByUser(Request $request)
    {
        $request->validate([
            'idBranch' => ['required', 'exists:branches,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'user' => ['required', 'exists:users,id'],
            'role' => ['required', 'exists:role_modules,name'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $module = Module::find($request->idModule);
        $role = RoleModule::findByName($request->role);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes asignar un rol a un administrador', 'success' => false]);
        }

        if (!$user->branches()->where('branches.id', $branch->id)->exists())
        {
            return response()->json(['message' => 'La sucursal no ha sido asignada al usuario', 'success' => false]);
        }

        if ($branch->status === 'inactive')
        {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        $exists = $user->modulesRole()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists();

        if ($exists)
        {
            DB::table('model_has_module_role')
                ->where('model_id', $user->id)
                ->where('module_id', $module->id)
                ->where('branch_id', $branch->id)
                ->update(['role_id' => $role->id]);
        }
        else $user->modulesRole()->attach($module->id, ['role_id' => $role->id, 'model_type' => User::class, 'branch_id' => $branch->id]);

        $this->cleanPermissionsModulesByUser($user,  $branch, $module);
        if ($role->name === 'encargado') $this->assingDefaultPermissions($branch, $module, $role, $user);

        return response()->json(['message' => 'Rol asignado con exito', 'success' => true]);
    }

    public function managedModulesByUser(Request $request)
    {
        $request->validate([
            'idBranch' => ['required', 'exists:branches,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);
        $module = Module::find($request->idModule);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar modulos a un administrador', 'success' => false]);
        }

        if (!$user->branches()->where('branches.id', $branch->id)->exists())
        {
            return response()->json(['message' => 'La sucursal no ha sido asignada al usuario', 'success' => false]);
        }

        if ($branch->status === 'inactive')
        {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if ($user->modules()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists())
        {
            $menuIds = $module->menus()->pluck('id');
            $menus = Menu::whereIn('id', $menuIds)->get();
            $submenuIds = $menus->pluck('submenus')->flatten()->pluck('id');

            DB::table('model_has_module_role')
                ->where('model_id', $user->id)
                ->where('module_id', $module->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_modules')
                ->where('model_id', $user->id)
                ->where('module_id', $module->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menus')
                ->where('model_id', $user->id)
                ->whereIn('menu_id', $menuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenus')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_module_permissions')
                ->where('model_id', $user->id)
                ->where('module_id', $module->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('menu_id', $menuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->whereIn('submenu_id', $submenuIds)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Modulo quitado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->modules()->attach($request->idModule, [
            'model_type' => User::class,
            'branch_id' => $branch->id
        ]);

        // Solo asigna permisos si el módulo NO tiene menús
        if ($module->menus()->count() === 0)
        {
            $module->userPermissions()->attach(
                Permission::findByName('read')->id,
                ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]
            );
        }

        return response()->json(['message' => 'Modulo agregado con exito', 'action' => 'add', 'success' => true]);
    }

    public function getPermissionsModulesByUser(User $user, Module $module, Branch $branch)
    {
        $permissions = $module->userPermissions()
            ->select('permissions.name')
            ->where('branch_id', $branch->id)
            ->where('model_id', $user->id)
            ->where('model_type', User::class)->get();

        return $permissions;
    }

    public function managedPermissionsModulesByUser(Request $request)
    {
        $request->validate([
            'user' => ['required', 'exists:users,id'],
            'idBranch' => ['required', 'exists:branches,id'],
            'idModule' => ['required', 'exists:modules,id'],
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $user = User::find($request->user);
        $module = Module::find($request->idModule);
        $branch = Branch::find($request->idBranch);
        $permission = Permission::findByName($request->permission);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar permisos a un administrador', 'success' => false]);
        }

        if (!$user->modules()->where([['modules.id', $module->id], ['branch_id', $branch->id]])->exists())
        {
            return response()->json(['message' => 'El módulo no está asignado al usuario', 'success' => false]);
        }

        $hasPermission = $module->userPermissions()
            ->where('permissions.id', $permission->id)
            ->where('model_id', $user->id)
            ->where('branch_id', $branch->id)
            ->where('model_type', User::class)
            ->exists();

        if ($hasPermission)
        {
            DB::table('model_has_module_permissions')
                ->where('module_id', $module->id)
                ->where('branch_id', $branch->id)
                ->where('permission_id', $permission->id)
                ->where('model_id', $user->id)
                ->where('model_type', User::class)
                ->delete();

            return response()->json(['message' => 'Permiso eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $module->userPermissions()->attach($permission->id, ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]);

        return response()->json(['message' => 'Permiso agregado con exito', 'action' => 'add', 'success' => true]);
    }

    private function cleanPermissionsModulesByUser(User $user, Branch $branch, Module $module)
    {
        DB::table('model_has_module_permissions')
            ->where('model_id', $user->id)
            ->where('module_id', $module->id)
            ->where('branch_id', $branch->id)
            ->delete();

        $menus = $module->menus()->get();

        foreach ($menus as $menu)
        {
            DB::table('model_has_menus')
                ->where('model_id', $user->id)
                ->where('menu_id', $menu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->where('menu_id', $menu->id)
                ->where('branch_id', $branch->id)
                ->delete();

            $submenus = $menu->submenus()->get();

            foreach ($submenus as $submenu)
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
            }
        }
    }


    private function assingDefaultPermissions($branch, $module, $roleModule, $user)
    {
        if ($module->menus()->count() === 0)
        {
            $module->userPermissions()->attach(
                $roleModule->permissions()->pluck('id')->toArray(),
                ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]
            );
        }

        $menus = $module->menus()->get();

        foreach ($menus as $menu)
        {
            $user->menus()->attach($menu->id, ['model_type' => User::class, 'branch_id' => $branch->id]);

            if ($menu->submenus()->count() === 0)
            {
                $menu->userPermissions()->attach(
                    $roleModule->permissions()->pluck('id')->toArray(),
                    ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]
                );
            }

            $submenus = $menu->submenus()->get();

            foreach ($submenus as $submenu)
            {
                $user->submenus()->attach($submenu->id, ['model_type' => User::class, 'branch_id' => $branch->id]);

                $submenu->userPermissions()->attach($roleModule->permissions()->pluck('id')->toArray(), ['model_type' => User::class, 'model_id' => $user->id, 'branch_id' => $branch->id]);
            }
        }
    }
}
