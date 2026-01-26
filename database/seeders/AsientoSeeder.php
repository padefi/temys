<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contabilidad\Asientos\Asiento;

class AsientoSeeder extends Seeder
{
    public function run(): void
    {
        // Asientos pendientes
        Asiento::factory()
            ->count(10)
            ->create();

        // Asientos controlados
        Asiento::factory()
            ->count(5)
            ->controlado()
            ->create();

        // Asientos anulados
        Asiento::factory()
            ->count(2)
            ->anulado()
            ->create();
    }
}
