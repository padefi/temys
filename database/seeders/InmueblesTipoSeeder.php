<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\Inmueble_tipo;
use App\Models\Patrimonio\Inmuebles\TipoInmueble;
use Illuminate\Database\Seeder;

class InmueblesTipoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = ['Casa', 'Departamento', 'Local', 'Terreno', 'Galpón'];

        foreach ($tipos as $tipo) {
            Inmueble_tipo::create(['descripcion' => $tipo]);
        }
    }
}

