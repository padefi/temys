<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\OrdenCompra;
use App\Models\Compras\OrdenCompraDetalle;

class OrdenCompraDetalleSeeder extends Seeder
{
    public function run()
    {
        $ordenes = OrdenCompra::all();

        foreach ($ordenes as $orden) {
            OrdenCompraDetalle::factory()
                ->count(rand(1, 5))
                ->create([
                    'orden_compra_id' => $orden->id,
                ]);
        }
    }
}
