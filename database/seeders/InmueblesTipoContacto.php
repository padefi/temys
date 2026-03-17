<?php

namespace Database\Seeders;


use App\Models\Patrimonio\Inmuebles\InmuebleTipoContacto;

use Illuminate\Database\Seeder;

class InmueblesTipoContacto extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contactos = ['Telefono', 'Email', 'Celular'];

        foreach ($contactos as $contacto) {
            InmuebleTipoContacto::create(['descripcion' => $contacto]);
        }
    }
}
