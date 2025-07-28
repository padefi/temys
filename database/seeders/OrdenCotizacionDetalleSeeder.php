<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;

class OrdenCotizacionDetalleSeeder extends Seeder
{
    public function run(): void
    {
        OrdenCotizacionDetalle::factory()->count(50)->create();
    }
}
