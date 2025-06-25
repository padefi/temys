<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\InmuebleTipo;
use Illuminate\Database\Seeder;

class InmueblesTipoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = ['Casa', 'Departamento', 'Local', 'Terreno', 'Galpón'];

        foreach ($tipos as $tipo) {
            InmuebleTipo::create(['descripcion' => $tipo]);
        }
    }
}

