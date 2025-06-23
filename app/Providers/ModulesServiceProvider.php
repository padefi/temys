<?php

namespace App\Providers;

use App\Http\Resources\ControlAcceso\MenuResource;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use Illuminate\Support\Facades\Auth;
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
        Inertia::share('modules', function () {
            $user = Auth::user();
            
            if (!$user) {
                return [];
            }

            $modules = Module::query()
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('model_id', $user->id);
                })
                ->get();

            return ModuleResource::collection($modules);
        });

        Inertia::share('menus', function () {
            $user = Auth::user();
            $request = request();
            $modulo = Module::query()->where('key', $request->segment(1))->first();

            if (!$user || !$modulo) {
                return [];
            }

            $menus = Menu::query()
                ->whereHas('modules', function ($query) use ($modulo) {
                    $query->where('module_id', $modulo->id);
                })
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('model_id', $user->id);
                })
                ->with(['submenus' => function ($q) use ($user) {
                    $q->whereHas('users', function ($sq) use ($user) {
                        $sq->where('model_id', $user->id);
                    });
                }])
                ->get();

            return [
                'modulo' => $modulo->key,
                'menus' => MenuResource::collection($menus)
            ];
        });
    }
}
