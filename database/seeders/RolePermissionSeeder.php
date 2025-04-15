<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::findByName('admin');
        $allPermissions = Permission::all();
        $adminRole->syncPermissions($allPermissions);

        $modules = Module::all();

        try
        {
            foreach ($modules as $module)
            {

                DB::table('role_has_modules')
                    ->insert([
                        'module_id' => $module->id,
                        'role_id' => $adminRole->id,
                    ]);
            }
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar el módulo al rol admin: ' . $th->getMessage());
            throw $th;
        }
    }
}
