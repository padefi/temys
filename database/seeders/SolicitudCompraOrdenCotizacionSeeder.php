<?php

namespace Database\Seeders;

use App\Models\Compras\SolicitudCompraOrdenCotizacion;
use Illuminate\Database\Seeder;

class SolicitudCompraOrdenCotizacionSeeder extends Seeder
{
    public function run(): void
    {
        SolicitudCompraOrdenCotizacion::factory(10)->create();
    }
}
