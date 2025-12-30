<?php

namespace Database\Seeders;

use App\Models\Ventas\OrdenCotizacionVentaDetalle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenCotizacionVentaDetalleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrdenCotizacionVentaDetalle::factory()->count(50)->create();
    }
}
