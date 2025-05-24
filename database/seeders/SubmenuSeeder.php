<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\Submenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubmenuSeeder extends Seeder
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
                    Log::warning("Module with key '{$moduleConfig['key']}' not found when seeding submenus. Skipping its menus.");
                    continue;
                }

                if (isset($moduleConfig['menus']) && is_array($moduleConfig['menus']))
                {
                    foreach ($moduleConfig['menus'] as $menuConfig)
                    {
                        if (isset($menuConfig['submenus']) && is_array($menuConfig['submenus']) && !empty($menuConfig['submenus']))
                        {
                            $parentMenu = Menu::firstWhere('key', $menuConfig['key']);

                            if (!$parentMenu)
                            {
                                Log::warning("Parent menu with key '{$menuConfig['key']}' not found (for module '{$moduleConfig['key']}'). Cannot seed its submenus.");
                                continue;
                            }

                            foreach ($menuConfig['submenus'] as $submenuConfig)
                            {
                                $submenu = Submenu::create([
                                    'key' => $submenuConfig['key'],
                                    'name' => $submenuConfig['name'],
                                    'guard_name' => $guardName,
                                ]);

                                $parentMenu->submenus()->attach($submenu);
                            }
                        }
                    }
                }
            }

            DB::commit();
        }
        catch (\Throwable $th)
        {
            DB::rollBack();
            Log::error('Error al asignar el submenú al menú: ' . $th->getMessage());
            throw $th;
        }
    }
}
