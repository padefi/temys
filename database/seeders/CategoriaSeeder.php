<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Inventario\Productos\ProductoCategoria;


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
            ProductoCategoria::create($categoria);
        }
    }
}
