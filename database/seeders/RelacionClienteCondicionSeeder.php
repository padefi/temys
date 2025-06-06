<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RelacionClienteCondicion;

class RelacionClienteCondicionSeeder extends Seeder
{
    public function run()
    {
        // Asignar condiciones de IVA aleatorias a los clientes
        $clientes = \App\Models\Cliente::all();

        foreach ($clientes as $cliente) {
            // Asignar 1-3 condiciones de IVA por cliente
            $condicionesIds = \App\Models\CondicionIva::inRandomOrder()
                ->limit(rand(1, 3))
                ->pluck('id')
                ->toArray();

            foreach ($condicionesIds as $condicionId) {
                RelacionClienteCondicion::create([
                    'id_cliente' => $cliente->id,
                    'id_iva' => $condicionId
                ]);
            }
        }
    }
}
