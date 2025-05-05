<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

    public function showModulesByUser(User $user)
    {
        $modules = Module::leftJoin('model_has_modules', function ($join) use ($user)
        {
            $join->on('modules.id', '=', 'model_has_modules.module_id')
                ->where('model_has_modules.model_id', '=', $user->id);
        })
            ->select('modules.*', DB::raw('IF(model_has_modules.module_id IS NOT NULL, true, false) as is_assigned')) // Verifica si el módulo estaba asignado al usuario
            ->get();

        return ModuleResource::collection($modules);
    }

    public function managedModulesByUser(User $user, Module $module)
    {
        if ($user->modules()->where('modules.id', $module->id)->exists())
        {
            $user->modules()->detach($module->id);
            DB::table('model_has_menus')->whereIn('menu_id', $module->menus()->pluck('id'))->delete();
            DB::table('model_has_submenus')->whereIn('submenu_id', function ($query) use ($module)
            {
                $query->select('submenus.id')
                    ->from('submenus')
                    ->join('menu_has_submenus', 'submenus.id', '=', 'menu_has_submenus.submenu_id')
                    ->join('module_has_menus', 'menu_has_submenus.menu_id', '=', 'module_has_menus.menu_id')
                    ->where('module_has_menus.module_id', $module->id);
            })->delete();

            return response()->json(['message' => 'Modulo eliminado con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->modules()->attach($module->id, ['model_type' => User::class]);

        return response()->json(['message' => 'Modulo agregado con exito', 'action' => 'add', 'success' => true]);
    }
}
