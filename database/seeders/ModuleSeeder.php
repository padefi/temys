<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Module;
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
            ['key' => 'control-acceso', 'name' => 'Control de Acceso'],
            ['key' => 'afiliados', 'name' => 'Afiliados'],
            ['key' => 'compras', 'name' => 'Compras'],
            ['key' => 'contabilidad', 'name' => 'Contabilidad'],
            ['key' => 'inventario', 'name' => 'Inventario'],
            ['key' => 'seccionales', 'name' => 'Seccionales'],
            ['key' => 'ventas', 'name' => 'Ventas'],
        ];

        foreach ($modules as $module)
        {
            Module::create(['key' => $module['key'], 'name' => $module['name'], 'guard_name' => 'web']);
        }
    }
}
