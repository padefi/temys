<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\RoleModule;
use Illuminate\Database\Seeder;

class RoleModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleModules = [
            ['name' => 'encargado', 'guard_name' => 'web'],
            // ['name' => 'auxiliar', 'guard_name' => 'web'],
            ['name' => 'administrativo', 'guard_name' => 'web'],
        ];

        foreach ($roleModules as $role)
        {
            RoleModule::create($role);
        }
    }
}
