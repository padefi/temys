<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enabledModulesConfig = config('module.enabled_modules', []);
        $guardName = 'web';

        DB::beginTransaction();

        try
        {
            foreach ($enabledModulesConfig as $moduleConfig)
            {
                $module = Module::firstWhere('key', $moduleConfig['key']);
                if (!$module)
                {
                    Log::warning("Modulo con la key'{$moduleConfig['key']}' no encontrado. Salteando el menú.");
                }

                if (isset($moduleConfig['menus']) && is_array($moduleConfig['menus']))
                {
                    foreach ($moduleConfig['menus'] as $menuConfig)
                    {
                        $menu = Menu::create([
                            'key' => $menuConfig['key'],
                            'name' => $menuConfig['name'],
                            'guard_name' => $guardName,
                        ]);

                        $module->menus()->attach($menu->id);
                    }
                }
            }

            DB::commit();
        }
        catch (\Throwable $th)
        {
            DB::rollBack();
            Log::error('Error al asignar el menú al módulo: ' . $th->getMessage());
            throw $th;
        }
    }
}
