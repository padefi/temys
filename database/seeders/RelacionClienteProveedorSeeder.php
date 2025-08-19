<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\RelacionClienteProveedor;

class RelacionClienteProveedorSeeder extends Seeder
{
    public function run()
    {
        // Crear 50 relaciones aleatorias
        RelacionClienteProveedor::factory()->count(50)->create();
    }
}
