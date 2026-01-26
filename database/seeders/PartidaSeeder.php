<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;

class PartidaSeeder extends Seeder
{
    public function run(): void
    {
        Asiento::all()->each(function (Asiento $asiento)
        {
            $importe = rand(1000, 50000);

            // Debe
            Partida::factory()
                ->debe($importe)
                ->create([
                    'co_asiento_id' => $asiento->id,
                ]);

            // Haber
            Partida::factory()
                ->haber($importe)
                ->create([
                    'co_asiento_id' => $asiento->id,
                ]);
        });
    }
}
