<?php

namespace Database\Seeders;

use App\Models\Ventas\OrdenCotizacionVenta;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenCotizacionVentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ordenCotizacionVenta::factory()->count(20)->create();
    }
}
