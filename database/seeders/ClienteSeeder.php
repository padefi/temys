<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\Cliente\Cliente;

class ClienteSeeder extends Seeder
{
    public function run()
    {
        // Crear 30 clientes
        Cliente::factory()->count(30)->create();
    }
}
