<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\Productos\Producto;
use App\Models\Inventario\Productos\ProductoCaracteristica;

class RelacionProductoCaracteristicaSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener todos los productos y características existentes
        $productos = Producto::all();
        $caracteristicas = ProductoCaracteristica::all();

        // Para cada producto, asignar entre 1 y 3 características aleatorias (si existen)
        foreach ($productos as $producto) {
            $caracteristicasAleatorias = $caracteristicas->random(rand(1, min(3, $caracteristicas->count())));

            // Asociar usando la relación belongsToMany (tabla pivot)
            $producto->caracteristicas()->syncWithoutDetaching($caracteristicasAleatorias->pluck('id')->toArray());
        }
    }
}
