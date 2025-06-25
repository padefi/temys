<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\InmuebleTipoOcupacions;
use Illuminate\Database\Seeder;


class InmueblesTipoOcupacionSeeder extends Seeder
{
    public function run(): void
    {
        $ocupaciones = ['Propietario', 'Inquilino', 'Usufructuario'];

        foreach ($ocupaciones as $ocupacion) {
            InmuebleTipoOcupacions::create(['descripcion' => $ocupacion]);
        }
    }
}
