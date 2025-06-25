<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\Productos\Caracteristica;
use App\Models\Inventario\Productos\Producto_caracteristica;

class CaracteristicaSeeder extends Seeder
{
    public function run()
    {
        $caracteristicas = [
            'Color Rojo',
            'Tamaño Mediano',
            'Material Acero Inoxidable',
            'Pantalla Táctil',
            'Batería de larga duración',
            'Resistente al agua',
            'Conectividad Bluetooth',
            'Eficiencia Energética A++',
            'Incluye control remoto',
            'Diseño ergonómico'
        ];

        foreach ($caracteristicas as $descripcion) {
            Producto_caracteristica::create([
                'descripcion' => $descripcion
            ]);
        }
    }
}
