<?php

namespace App\Providers;

use App\Http\Resources\ControlAcceso\BranchResource;
use App\Http\Resources\ControlAcceso\MenuResource;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Branch;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class ModulesServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Inertia::share([
            'active_branch_id' => function ()
            {
                return Session::get('active_branch_id') ?? Auth::user()->branch_id ?? null;
            },
            'branches' => function ()
            {
                $user = Auth::user();

                if (!$user)
                {
                    return [];
                }

                $branches = Branch::query()
                    ->whereHas('users', function ($query) use ($user)
                    {
                        $query->where([
                            ['status', 'active'],
                            ['model_id', $user->id]
                        ]);
                    })
                    ->get();

                return BranchResource::collection($branches);
            },
            'modules' => function ()
            {
                $user = Auth::user();
                $activeBranchId = session('active_branch_id');

                if (!$user || !$activeBranchId)
                {
                    return [];
                }

                $modules = Module::query()
                    ->whereHas('users', function ($query) use ($user, $activeBranchId)
                    {
                        $query->where([
                            ['model_id', $user->id],
                            ['branch_id', $activeBranchId]
                        ]);
                    })
                    ->get();

                return ModuleResource::collection($modules);
            },
            'menus' => function ()
            {
                $user = Auth::user();
                $request = request();
                $modulo = Module::query()->where('key', $request->segment(1))->first();
                $activeBranchId = session('active_branch_id');

                if (!$user || !$modulo || !$activeBranchId)
                {
                    return [];
                }

                $menus = Menu::query()
                    ->whereHas('modules', function ($query) use ($modulo)
                    {
                        $query->where('module_id', $modulo->id);
                    })
                    ->whereHas('users', function ($query) use ($user, $activeBranchId)
                    {
                        $query->where([
                            ['model_id', $user->id],
                            ['branch_id', $activeBranchId]
                        ]);
                    })
                    ->with(['submenus' => function ($q) use ($user, $activeBranchId)
                    {
                        $q->whereHas('users', function ($sq) use ($user, $activeBranchId)
                        {
                            $sq->where([
                                ['model_id', $user->id],
                                ['branch_id', $activeBranchId]
                            ]);
                        });
                    }])
                    ->get();

                return [
                    'modulo' => $modulo->key,
                    'menus' => MenuResource::collection($menus)
                ];
            },
        ]);
    }
}
