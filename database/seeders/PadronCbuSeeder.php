<?php

namespace Database\Seeders;

use App\Models\Padron\PadronCbu;
use Illuminate\Database\Seeder;

class PadronCbuSeeder extends Seeder
{
    public function run(): void
    {
        PadronCbu::factory()->count(20)->create();
    }
}

