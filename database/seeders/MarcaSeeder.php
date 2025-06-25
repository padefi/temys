<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\Productos\Marca;
use App\Models\Inventario\Productos\Producto_marca;
use Illuminate\Support\Facades\DB;

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
            Producto_marca::create($marca);
        }
    }
}
