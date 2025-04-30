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

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::all();

        return Inertia::render('ControlAcceso/Menu/Index', [
            'menus' => MenuResource::collection($menus),
        ]);
    }

    public function showMenus(User $user, Module $module)
    {
        $menus = Menu::join('module_has_menus', 'menus.id', '=', 'module_has_menus.menu_id')
            ->where('module_has_menus.module_id', $module->id)
            ->select('menus.*')
            ->get();

        return MenuResource::collection($menus);
    }

    public function showMenusByUser(User $user, Module $module)
    {
        $userId = $user->id;
        $menus = Menu::leftJoin('module_has_menus', 'menus.id', '=', 'module_has_menus.menu_id')
        ->leftJoin('model_has_menus', function ($join) use ($userId) {
            $join->on('menus.id', '=', 'model_has_menus.menu_id')
                 ->where('model_has_menus.model_id', '=', $userId);
        })
        ->where('module_has_menus.module_id', $module->id) // Verifica que el menú pertenece al módulo
        ->select(
            'menus.*',
            DB::raw('IF(model_has_menus.menu_id IS NOT NULL, true, false) as is_assigned') // Verifica si el menú está asignado al usuario
        )
        ->get();

        return MenuResource::collection($menus);
    }
}
