<?php

namespace Database\Seeders;

use App\Models\Padron\Proveedor\ProveedorCbu;
use Illuminate\Database\Seeder;

class ProveedorCbuSeeder extends Seeder
{
    public function run(): void
    {
        ProveedorCbu::factory()->count(20)->create();
    }
}

