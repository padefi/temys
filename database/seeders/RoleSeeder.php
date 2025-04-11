<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'admin'],
            ['name' => 'encargado'],
            ['name' => 'auxiliar'],
            ['name' => 'administrativo'],
        ];

        foreach ($roles as $role)
        {
            Role::create($role);
        }
    }
}
