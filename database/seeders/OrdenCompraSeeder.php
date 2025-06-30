<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\OrdenCompra;

class OrdenCompraSeeder extends Seeder
{
    public function run()
    {
        OrdenCompra::factory()->count(120)->create();
    }
}
