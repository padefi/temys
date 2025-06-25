<?php

namespace Database\Seeders;

use App\Models\Inventario\Productos\Producto_subcategoria;
use Illuminate\Database\Seeder;


class SubcategoriaSeeder extends Seeder
{
   public function run(): void
    {
        Producto_subcategoria::factory()->count(10)->create();
    }
}
