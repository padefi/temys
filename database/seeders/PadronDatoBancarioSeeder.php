<?php

namespace Database\Seeders;

use App\Models\Padron\PadronDatoBancario;
use Illuminate\Database\Seeder;

class PadronDatoBancarioSeeder extends Seeder
{
    public function run(): void
    {
        PadronDatoBancario::factory()->count(20)->create();
    }
}

