<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Inventario\Productos\Producto_modelo;


class ModeloSeeder extends Seeder
{
    public function run(): void
    {
        Producto_modelo::factory()->count(10)->create();
    }
}
