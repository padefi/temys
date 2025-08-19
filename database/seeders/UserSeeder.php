<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Branch;
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
            'name' => 'Admin',
            'last_name' => 'Administrador',
            'email' => 'admin@admin.com',
            'password' => Hash::make('12345678'),
        ]);
        $admin->assignRole('admin');

        User::factory()->count(20)->create()->each(function ($user)
        {
            $user->assignRole('empleado');
        });

        $this->call(BranchSeeder::class);

        $branches = Branch::all();
        $permissions = Permission::all()->pluck('id')->toArray();
        $enabledModules  = config('module.enabled_modules', []);

        try
        {
            foreach ($branches as $branch)
            {
                $admin->branches()->attach($branch->id, [
                    'model_type' => User::class
                ]);

                foreach ($enabledModules as $moduleName)
                {
                    $module = Module::where('key', $moduleName['key'])->first();

                    if ($module)
                    {
                        $admin->modules()->attach($module->id, [
                            'model_type' => User::class,
                            'branch_id' => $branch->id,
                        ]);

                        // Solo asigna permisos si el módulo NO tiene menús
                        if ($module->menus()->count() === 0)
                        {
                            $module->userPermissions()->attach(
                                $permissions,
                                [
                                    'model_type' => User::class,
                                    'model_id' => $admin->id,
                                    'branch_id' => $branch->id
                                ]
                            );
                        }

                        $menus = $module->menus()->get();

                        foreach ($menus as $menu)
                        {
                            $admin->menus()->attach($menu->id, [
                                'model_type' => User::class,
                                'branch_id' => $branch->id
                            ]);

                            // Solo asigna permisos si el menú NO tiene submenús
                            if ($menu->submenus()->count() === 0)
                            {
                                $menu->userPermissions()->attach(
                                    $permissions,
                                    [
                                        'model_type' => User::class,
                                        'model_id' => $admin->id,
                                        'branch_id' => $branch->id
                                    ]
                                );
                            }

                            $submenus = $menu->submenus()->get();

                            foreach ($submenus as $submenu)
                            {
                                $admin->submenus()->attach($submenu->id, [
                                    'model_type' => User::class,
                                    'branch_id' => $branch->id
                                ]);
                                $submenu->userPermissions()->attach($permissions, [
                                    'model_type' => User::class,
                                    'model_id' => $admin->id,
                                    'branch_id' => $branch->id
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
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar el módulo al usuario prueba: ' . $th->getMessage());
            throw $th;
        }
    }
}
