<?php

namespace Database\Seeders;


use App\Models\Inventario\Productos\ProductoSubcategoria;
use Illuminate\Database\Seeder;


class SubcategoriaSeeder extends Seeder
{
   public function run(): void
    {
        ProductoSubcategoria::factory()->count(10)->create();
    }
}
