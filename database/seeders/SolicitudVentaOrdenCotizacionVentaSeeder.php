<?php

namespace Database\Seeders;

use App\Models\Ventas\SolicitudVentaOrdenCotizacionVenta;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SolicitudVentaOrdenCotizacionVentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SolicitudVentaOrdenCotizacionVenta::factory(10)->create();
    }
}
