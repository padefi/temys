<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InmuebleTipoOcupacion;
use App\Models\Patrimonio\Inmuebles\TipoOcupacion;

class InmueblesTipoOcupacionSeeder extends Seeder
{
    public function run(): void
    {
        $ocupaciones = ['Propietario', 'Inquilino', 'Usufructuario'];

        foreach ($ocupaciones as $ocupacion) {
            TipoOcupacion::create(['descripcion' => $ocupacion]);
        }
    }
}
