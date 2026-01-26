<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\InmuebleTipoContrato;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InmueblesTipoContratoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
  
    
        $contratos = ['Comodato', 'Alquiler', 'Escritura'];

        foreach ($contratos as $contrato) {
            InmuebleTipoContrato::create(['descripcion' => $contrato]);
        }
    
    }
}
