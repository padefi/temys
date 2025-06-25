<?php

namespace Database\Seeders;

use App\Models\Inventario\Productos\ProductoMarca;
use Illuminate\Database\Seeder;


class MarcaSeeder extends Seeder
{
    public function run(): void
    {
    

        $marcas = [
            ['descripcion' => 'Lenovo'],
            ['descripcion' => 'Apple'],
            ['descripcion' => 'Dell'],
        ];

        foreach ($marcas as $marca) {
            ProductoMarca::create($marca);
        }
    }
}
