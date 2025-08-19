<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\ControlAcceso\User;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'permissions' => $this->userPermissions(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => fn() => $request->session()->get('flash'),
        ]);
    }

    private function userPermissions()
    {
        if (!Auth::user())
        {
            return null;
        }

        $user = User::with([
            'userRoles:id,name',
            'modulesRole:id,name',
            'modulePermissions',
            'menuPermissions',
            'submenuPermissions'
        ])->find(Auth::id());

        $allPermissions = \Spatie\Permission\Models\Permission::all(['id', 'name'])->keyBy('id');

        $user->permissions = $user->permissions->map(fn($permission) => $allPermissions[$permission->id])->values()->unique();

        $modulePermissions = $user->modulePermissions
            ->groupBy('id')
            ->map(
                function ($group) use ($allPermissions)
                {
                    $permission_ids = $group->pluck('pivot.permission_id')->filter()->unique()->values();
                    $permissions = $permission_ids->map(fn($id) => [
                        // 'id' => $id,
                        'name' => $allPermissions[$id]->name ?? null,
                    ]);
                    return [
                        'permissions' => $permissions,
                    ];
                }
            )
            ->values();

        $menuPermissions = $user->menuPermissions
            ->groupBy('id')
            ->map(
                function ($group) use ($allPermissions)
                {
                    $permission_ids = $group->pluck('pivot.permission_id')->filter()->unique()->values();
                    $permissions = $permission_ids->map(fn($id) => [
                        // 'id' => $id,
                        'name' => $allPermissions[$id]->name ?? null,
                    ]);
                    return [
                        'id' => $group->first()->id,
                        'key' => $group->first()->key,
                        'permissions' => $permissions,
                    ];
                }
            )
            ->values();

        $submenuPermissions = $user->submenuPermissions
            ->groupBy('id')
            ->map(
                function ($group) use ($allPermissions)
                {
                    $permission_ids = $group->pluck('pivot.permission_id')->filter()->unique()->values();
                    $permissions = $permission_ids->map(fn($id) => [
                        // 'id' => $id,
                        'name' => $allPermissions[$id]->name ?? null,
                    ]);
                    return [
                        'id' => $group->first()->id,
                        'key' => $group->first()->key,
                        'permissions' => $permissions,
                    ];
                }
            )
            ->values();

        return [
            'roles' => $user->userRoles,
            'modules_role' => $user->modulesRole,
            'module_permissions' => $modulePermissions,
            'menu_permissions' => $menuPermissions,
            'submenu_permissions' => $submenuPermissions,
        ];
    }
}
