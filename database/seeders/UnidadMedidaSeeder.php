<?php

namespace Database\Seeders;

use App\Models\General\UnidadMedida;
use Illuminate\Database\Seeder;

class UnidadMedidaSeeder extends Seeder
{
    public function run(): void
    {
        $unidades = [
            ['codigo' => 'UNI', 'nombre' => 'Unidad', 'descripcion' => 'Cantidad unitaria'],
            ['codigo' => 'KG', 'nombre' => 'Kilogramo', 'descripcion' => 'Medida de masa'],
            ['codigo' => 'L', 'nombre' => 'Litro', 'descripcion' => 'Medida de volumen'],
            ['codigo' => 'M', 'nombre' => 'Metro', 'descripcion' => 'Medida de longitud'],
            ['codigo' => 'CAJ', 'nombre' => 'Caja', 'descripcion' => 'Contiene varias unidades'],
            ['codigo' => 'PAQ', 'nombre' => 'Paquete', 'descripcion' => 'Empaque de varios artículos'],
        ];

        foreach ($unidades as $unidad) {
            UnidadMedida::firstOrCreate(['codigo' => $unidad['codigo']], $unidad);
        }
    }
}
