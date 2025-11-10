<?php

// database/seeders/TarjetaSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Tarjeta;

class TarjetaSeeder extends Seeder
{
    public function run(): void {
        Tarjeta::factory(20)->create();
    }
}

