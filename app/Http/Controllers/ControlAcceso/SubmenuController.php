<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\SubmenuResource;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Submenu;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
        $submenus = Submenu::join('menu_has_submenus', 'submenus.id', '=', 'menu_has_submenus.submenu_id')
            ->where('menu_has_submenus.menu_id', $menu->id)
            ->select('submenus.*')
            ->get();

        return SubmenuResource::collection($submenus);
    }

    public function showSubmenusByUser(User $user, Menu $menu)
    {
        $userId = $user->id;
        $submenus = Submenu::leftJoin('menu_has_submenus', 'submenus.id', '=', 'menu_has_submenus.submenu_id')
            ->leftJoin('model_has_submenus', function ($join) use ($userId) {
                $join->on('submenus.id', '=', 'model_has_submenus.submenu_id')
                     ->where('model_has_submenus.model_id', '=', $userId);
            })
            ->where('menu_has_submenus.menu_id', $menu->id) // Verifica que el submenú pertenece al menú
            ->select(
                'submenus.*',
                DB::raw('IF(model_has_submenus.submenu_id IS NOT NULL, true, false) as is_assigned') // Verifica si el submenú está asignado al usuario
            )
            ->get();

        return SubmenuResource::collection($submenus);
    }
}
