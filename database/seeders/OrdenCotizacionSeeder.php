<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;

class OrdenCotizacionSeeder extends Seeder
{
    public function run(): void
    {
        OrdenCotizacion::factory()->count(20)->create();
    }
}
