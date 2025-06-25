<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\Productos\Categoria;
use App\Models\Inventario\Productos\Producto_categoria;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
       
        $categorias = [
            ['descripcion' => 'Tecnología'],
            ['descripcion' => 'Mobiliario'],
            ['descripcion' => 'Oficina'],
        ];

        foreach ($categorias as $categoria) {
            Producto_categoria::create($categoria);
        }
    }
}
