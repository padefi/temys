<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InmuebleTipoEstado;
use App\Models\Patrimonio\Inmuebles\TipoEstado;

class InmueblesTipoEstadoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = ['Activo', 'Inactivo', 'En proceso', 'Demolido'];

        foreach ($estados as $estado) {
            TipoEstado::create(['descripcion' => $estado]);
        }
    }
}

