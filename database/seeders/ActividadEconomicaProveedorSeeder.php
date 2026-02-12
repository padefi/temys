<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;
use App\Models\ControlAcceso\User;

class ActividadEconomicaProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $usuarioId = User::inRandomOrder()->value('id');

        $actividades = [
            ['descripcion' => 'Intereses'],
            ['descripcion' => 'Alquileres'],
            ['descripcion' => 'Bienes Inmuebles Urbanos'],
            ['descripcion' => 'Enajenación de Bienes Muebles'],
            ['descripcion' => 'Locación de Obras y Servicios'],
            ['descripcion' => 'Comisiones'],
            ['descripcion' => 'Prof. Liberales'],
            ['descripcion' => 'Otra Cesión o Locación'],
            ['descripcion' => 'Transferencia de Derechos, LLaves, Marcas y Patentes'],
            ['descripcion' => 'No Aplica'],
        ];

        foreach ($actividades as $item) {
            ActividadEconomicaProveedor::create([
                'descripcion' => $item['descripcion'],
                'habilitado' => true,
                'fecha_creacion' => now(),
                'usuario_creacion' => $usuarioId,
                'fecha_actualizacion' => null,
                'usuario_actualizacion' => null,
            ]);
        }
    }
}
