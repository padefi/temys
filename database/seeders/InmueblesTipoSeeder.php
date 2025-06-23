<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InmuebleTipo;
use App\Models\Patrimonio\Inmuebles\InmuebleTipo as InmueblesInmuebleTipo;

class InmueblesTipoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = ['Casa', 'Departamento', 'Local', 'Terreno', 'Galpón'];

        foreach ($tipos as $tipo) {
            InmueblesInmuebleTipo::create(['descripcion' => $tipo]);
        }
    }
}

