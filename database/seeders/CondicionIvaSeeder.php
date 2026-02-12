<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\CondicionIva;

class CondicionIvaSeeder extends Seeder
{
    public function run()
    {
        $condiciones = [
            ['descripcion' => 'Responsable Inscripto'],
            ['descripcion' => 'Monotributista'],
            ['descripcion' => 'Exento'],
            ['descripcion' => 'Consumidor Final'],
            ['descripcion' => 'No Responsable'],
            ['descripcion' => 'Responsable no Inscripto']
        ];

        foreach ($condiciones as $condicion) {
            CondicionIva::factory()->create([
                'descripcion' => $condicion['descripcion'],
            ]);
        }
    }
}
