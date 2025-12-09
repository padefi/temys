<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contabilidad\Asientos\RelacionComprobantePartida;

class RelacionComprobantePartidaSeeder extends Seeder
{
    public function run(): void
    {

        // Genera 20 relaciones aleatorias
        RelacionComprobantePartida::factory()->count(20)->create();
    }
}
