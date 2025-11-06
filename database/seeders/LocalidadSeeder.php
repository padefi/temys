<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\Localidad;
use App\Models\Patrimonio\Inmuebles\Provincia;
use Illuminate\Database\Seeder;


class LocalidadSeeder extends Seeder
{
    public function run(): void
    {
        $bsas = Provincia::where('nombre', 'Buenos Aires')->first();
        $cordoba = Provincia::where('nombre', 'Córdoba')->first();

        $localidades = [
            ['nombre' => 'La Plata', 'provincia_id' => $bsas->id],
            ['nombre' => 'Mar del Plata', 'provincia_id' => $bsas->id],
            ['nombre' => 'Córdoba Capital', 'provincia_id' => $cordoba->id],
            ['nombre' => 'Villa Carlos Paz', 'provincia_id' => $cordoba->id],
        ];

        Localidad::insert($localidades);
    }
}
