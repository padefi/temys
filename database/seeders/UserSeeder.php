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
        $user = User::create([
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
            ])->assignRole('encargado');

            User::create([
                'name' => 'Prueba ' . $i++,
                'email' => 'prueba' . $i++ . '@prueba.com',
                'password' => Hash::make('12345678'),
            ])->assignRole('auxiliar');

            User::create([
                'name' => 'Prueba ' . $i++,
                'email' => 'prueba' . $i++ . '@prueba.com',
                'password' => Hash::make('12345678'),
            ])->assignRole('administrativo');
        }

        $enabledModules  = config('module.enabled_modules', []);

        try
        {
            foreach ($enabledModules as $moduleName)
            {
                $module = Module::where('key', $moduleName['key'])->first();

                if ($module)
                {
                    DB::table('model_has_modules')
                        ->insert([
                            'module_id' => $module->id,
                            'model_type' => $user::class,
                            'model_id' => $user->id,
                        ]);

                    $menus = $module->menus()->get();

                    foreach ($menus as $menu)
                    {
                        DB::table('model_has_menus')
                            ->insert([
                                'menu_id' => $menu->id,
                                'model_type' => $user::class,
                                'model_id' => $user->id,
                            ]);

                        $submenus = $menu->submenus()->get();

                        foreach ($submenus as $submenu)
                        {
                            DB::table('model_has_submenus')
                                ->insert([
                                    'submenu_id' => $submenu->id,
                                    'model_type' => $user::class,
                                    'model_id' => $user->id,
                                ]);
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
