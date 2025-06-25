<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patrimonio\Inmuebles\Inmueble_tipo_estado;


class InmueblesTipoEstadoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = ['Activo', 'Inactivo', 'En proceso', 'Demolido'];

        foreach ($estados as $estado) {
            Inmueble_tipo_estado::create(['descripcion' => $estado]);
        }
    }
}

