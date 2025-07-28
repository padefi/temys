<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\SolicitudCompra;

class SolicitudCompraSeeder extends Seeder
{
    public function run(): void
    {
        SolicitudCompra::factory()->count(20)->create();
    }
}
