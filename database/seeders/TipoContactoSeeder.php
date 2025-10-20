<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\InmuebleContacto;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoContacto;

use Illuminate\Database\Seeder;

class TipoContactoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $tipoContacto = ['Telefono', 'Celular', 'Email'];

        foreach ($tipoContacto as $contacto) {
            InmuebleTipoContacto::create(['descripcion' => $contacto]);
        }
    
    }
}
