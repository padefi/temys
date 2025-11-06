<?php

// database/seeders/BancoSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Banco;

class BancoSeeder extends Seeder
{
    public function run(): void {
        Banco::factory(10)->create();
    }
}
