<?php

namespace Database\Seeders;

use App\Models\AccessControl\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'Afiliados',
            'Ventas',
            'Contabilidad',
        ];

        foreach ($modules as $module)
        {
            Module::create(['name' => $module]);
        }
    }
}
