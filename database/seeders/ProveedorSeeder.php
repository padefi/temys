<?php

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{

    public function run()
    {
        // Crear 30 Proveedores de ejemplo
        Proveedor::factory()->count(30)->create();
    }
}
