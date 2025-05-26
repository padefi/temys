<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Prueba',
            'email' => 'prueba@prueba.com',
            'password' => Hash::make('12345678'),
        ])->assignRole('admin');

        for ($i = 1; $i <= 10; $i++)
        {
            User::create([
                'name' => 'Prueba ' . $i,
                'email' => 'prueba' . $i . '@prueba.com',
                'password' => Hash::make('12345678'),
            ])->assignRole('empleado');
        }

        $enabledModules  = config('module.enabled_modules', []);

        try
        {
            foreach ($enabledModules as $moduleName)
            {
                $module = Module::where('key', $moduleName['key'])->first();

                if ($module)
                {
                    $admin->modules()->attach($module->id, ['model_type' => User::class]);

                    // Solo asigna permisos si el módulo NO tiene menús
                    if ($module->menus()->count() === 0)
                    {
                        $module->userPermissions()->attach(
                            Permission::all()->pluck('id')->toArray(),
                            ['model_type' => User::class, 'model_id' => $admin->id]
                        );
                    }

                    $menus = $module->menus()->get();

                    foreach ($menus as $menu)
                    {
                        $admin->menus()->attach($menu->id, ['model_type' => User::class]);

                        // Solo asigna permisos si el menú NO tiene submenús
                        if ($menu->submenus()->count() === 0)
                        {
                            $menu->userPermissions()->attach(
                                Permission::all()->pluck('id')->toArray(),
                                ['model_type' => User::class, 'model_id' => $admin->id]
                            );
                        }

                        $submenus = $menu->submenus()->get();

                        foreach ($submenus as $submenu)
                        {
                            $admin->submenus()->attach($submenu->id, ['model_type' => User::class]);
                            $submenu->userPermissions()->attach(Permission::all()->pluck('id')->toArray(), ['model_type' => User::class, 'model_id' => $admin->id]);
                        }
                    }
                }
                else
                {
                    Log::warning("No se encontró el modelo para el módulo: {$moduleName}");
                }
            }
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar el módulo al usuario prueba: ' . $th->getMessage());
            throw $th;
        }
    }
}
