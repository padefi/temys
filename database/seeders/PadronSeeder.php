<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron;

class PadronSeeder extends Seeder
{
    public function run()
    {
        // Crear 50 registros de prueba
        Padron::factory()->count(50)->create();
    }
}
