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
use App\QueryBuilders\Sorts\RoleSort;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $baseQuery = User::query()->select(['id', 'name', 'last_name', 'email', 'is_active', 'reset_password']);

        $users = QueryBuilder::for($baseQuery)
            // --- FILTROS PERMITIDOS ---
            // Los nombres de los filtros deben coincidir con los column.id que usas en el frontend
            // y que envías en filters[columnId].

            ->allowedFilters([
                AllowedFilter::partial('name'), // Filtros de búsqueda parcial (LIKE %valor%)
                AllowedFilter::partial('last_name'),
                AllowedFilter::partial('email'),
                AllowedFilter::callback('roles', function ($query, $value)
                {
                    if ($value === '__NO_ROLE__')
                    {
                        $query->doesntHave('roles');
                    }
                    else if (!empty($value))
                    {
                        $query->whereHas('roles', function ($q) use ($value)
                        {
                            $q->where('name', $value);
                        });
                    }
                }),
                // AllowedFilter::exact('is_active'), // Para booleanos o valores exactos
            ])

            ->allowedSorts([
                'name',
                'last_name',
                'email',
                AllowedSort::custom('roles', new RoleSort())->defaultDirection('desc'),
            ])
            ->defaultSort('id')
            ->paginate($request->input('per_page', 10))
            ->withQueryString(); // Esto es VITAL para que todos los filtros y el orden se mantengan en la paginación.

        // Carga de roles para el frontend (no cambia)
        $roles = Cache::remember('roles_list', 3600, function ()
        {
            $roles = Role::select(['id', 'name'])->get();
            return $roles;
        });

        $activeFilters = $request->input('filter', []);

        // Spatie almacena los filtros activos en un array 'filter' dentro del request.
        return Inertia::render('ControlAcceso/Usuarios/page', [
            'users' => UserResource::collection($users),
            'roles' => RoleResource::collection($roles),
            'filters' => $activeFilters,
        ]);
    }

    public function store(UserRequest $request)
    {
        $data = $request->all();
        $data['password'] = Hash::make('12345678');
        $user = User::create([
            'name' => strtoupper($request->name),
            'last_name' => strtoupper($request->last_name),
            'email' => strtoupper($request->email),
            'password' => $data['password'],
            'is_active' => 1,
        ]);
        $user->syncRoles($request->role);

        if ($request->role === 'admin') $this->assingDefaultPermissions($user);

        return response()->json(['message' => 'Usuario creado con exito', 'success' => true, 'user' => UserResource::make($user)]);
    }

    public function update(UserRequest $request, User $user)
    {
        if (!$user->is_active) return response()->json(['message' => 'El usuario se encuentra deshabilitado', 'success' => false]);

        $user->update([
            'name' => strtoupper($request->name),
            'last_name' => strtoupper($request->last_name),
            'email' => strtoupper($request->email),
        ]);
        $user->update(['updated_at' => now()]);
        $userRole = $user->roles()->first();
        $user->syncRoles($request->role);

        if ($userRole && strtolower($userRole->name) !== strtolower($request->role) && strtolower($request->role) !== 'admin') $this->cleanPermissionsByUser($user);
        elseif (strtolower($request->role) === 'admin')
        {
            $this->cleanPermissionsByUser($user);
            $this->assingDefaultPermissions($user);
        }

        return response()->json(['message' => 'Usuario actualizado con exito', 'success' => true, 'user' => UserResource::make($user)]);
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
        $action = "enable";

        if (!$user->is_active)
        {
            $user->syncRoles([]);
            $message = 'Usuario deshabilitado con exito';
            $action = "disable";
        }

        return response()->json(['message' => $message, 'action' => $action, 'success' => true]);
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

    private function cleanPermissionsByUser(User $user)
    {
        $user->modulesRole()->detach();
        $user->modules()->detach();
        $user->menus()->detach();
        $user->submenus()->detach();

        DB::table('model_has_module_permissions')
            ->where('model_id', $user->id)
            ->delete();

        DB::table('model_has_menu_permissions')
            ->where('model_id', $user->id)
            ->delete();

        DB::table('model_has_submenu_permissions')
            ->where('model_id', $user->id)
            ->delete();
    }

    private function assingDefaultPermissions($user)
    {
        $modules = Module::all();

        foreach ($modules as $module)
        {
            $user->modules()->attach($module->id, ['model_type' => User::class]);

            if ($module->menus()->count() === 0)
            {
                $module->userPermissions()->attach(
                    $user->roles()->first()->permissions()->pluck('id')->toArray(),
                    ['model_type' => User::class, 'model_id' => $user->id]
                );
            }

            $menus = $module->menus()->get();

            foreach ($menus as $menu)
            {
                $user->menus()->attach($menu->id, ['model_type' => User::class]);

                if ($menu->submenus()->count() === 0)
                {
                    $menu->userPermissions()->attach(
                        $user->roles()->first()->permissions()->pluck('id')->toArray(),
                        ['model_type' => User::class, 'model_id' => $user->id]
                    );
                }

                $submenus = $menu->submenus()->get();

                foreach ($submenus as $submenu)
                {
                    $user->submenus()->attach($submenu->id, ['model_type' => User::class]);

                    $submenu->userPermissions()->attach($user->roles()->first()->permissions()->pluck('id')->toArray(), ['model_type' => User::class, 'model_id' => $user->id]);
                }
            }
        }
    }
}
