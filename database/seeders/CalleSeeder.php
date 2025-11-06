<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\Calle;
use App\Models\Patrimonio\Inmuebles\Localidad;
use Illuminate\Database\Seeder;


class CalleSeeder extends Seeder
{
    public function run(): void
    {
        $laPlata = Localidad::where('nombre', 'La Plata')->first();
        $cordoba = Localidad::where('nombre', 'Córdoba Capital')->first();

        $calles = [
            ['nombre' => 'Calle 7', 'localidad_id' => $laPlata->id],
            ['nombre' => 'Calle 50', 'localidad_id' => $laPlata->id],
            ['nombre' => 'Av. Colón', 'localidad_id' => $cordoba->id],
            ['nombre' => 'Bv. San Juan', 'localidad_id' => $cordoba->id],
        ];

        Calle::insert($calles);
    }
}
