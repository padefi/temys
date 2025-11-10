<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contabilidad\MovimientoTesoreria;

class MovimientoTesoreriaSeeder extends Seeder
{
    public function run(): void
    {
        MovimientoTesoreria::factory()->count(20)->create();
    }
}
