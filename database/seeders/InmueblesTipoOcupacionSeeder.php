<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\Inmueble_tipo_ocupacions;
use Illuminate\Database\Seeder;


class InmueblesTipoOcupacionSeeder extends Seeder
{
    public function run(): void
    {
        $ocupaciones = ['Propietario', 'Inquilino', 'Usufructuario'];

        foreach ($ocupaciones as $ocupacion) {
            Inmueble_tipo_ocupacions::create(['descripcion' => $ocupacion]);
        }
    }
}
