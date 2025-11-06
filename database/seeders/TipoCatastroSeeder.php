<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\TipoCatastro;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipoCatastroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipoContacto = ['NACIONAL', 'PROVINCIAL', 'MUNICIPAL'];

        foreach ($tipoContacto as $contacto) {
            TipoCatastro::create(['descripcion' => $contacto]);
        }
    }
}
