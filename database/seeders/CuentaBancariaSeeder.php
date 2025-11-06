<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\CuentaBancaria;
use App\Models\General\Banco;

class CuentaBancariaSeeder extends Seeder
{
    public function run(): void
    {


        // Crear cuentas bancarias
        CuentaBancaria::factory()->count(10)->create();
    }
}
