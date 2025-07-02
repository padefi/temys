<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventario\InventarioStock;

class InventarioStockSeeder extends Seeder
{
    public function run(): void
    {
        InventarioStock::factory()->count(120)->create();
    }
}
