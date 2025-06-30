<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\InventarioMovimientoStock;

class InventarioMovimientoStockSeeder extends Seeder
{
    public function run(): void
    {
        InventarioMovimientoStock::factory()->count(120)->create();
    }
}

