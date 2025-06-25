<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


use App\Models\Inventario\Productos\ProductoModelo;

class ModeloSeeder extends Seeder
{
    public function run(): void
    {
        ProductoModelo::factory()->count(10)->create();
    }
}
