<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\InmuebleTipoEstado;
use Illuminate\Database\Seeder;



class InmueblesTipoEstadoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = ['Activo', 'Inactivo', 'En proceso', 'Demolido'];

        foreach ($estados as $estado) {
            InmuebleTipoEstado::create(['descripcion' => $estado]);
        }
    }
}

