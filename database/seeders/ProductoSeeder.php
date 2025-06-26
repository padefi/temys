<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


use App\Models\Inventario\Productos\Producto;

use App\Models\Inventario\Productos\ProductoCaracteristica;

class ProductoSeeder extends Seeder
{
    public function run()
    {
        Producto::factory()
            ->count(10) // Crea 10 productos
            ->create()
            ->each(function ($producto) {
                // Relacionar 3 características aleatorias (si existen)
                $caracteristicas = ProductoCaracteristica::inRandomOrder()->limit(3)->pluck('id');
                $producto->caracteristicas()->attach($caracteristicas);
            });
    }
}
