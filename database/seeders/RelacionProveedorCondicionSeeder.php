<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\Proveedor\RelacionProveedorCondicion;

class RelacionProveedorCondicionSeeder extends Seeder
{
    public function run()
    {
        // Asignar condiciones de IVA aleatorias a los proveedores
        $proveedores = \App\Models\Padron\Proveedor\Proveedor::all();

        foreach ($proveedores as $proveedor) {
            // Asignar 1-3 condiciones de IVA por proveedor
            $condicionesIds = \App\Models\Padron\CondicionIva::inRandomOrder()
                ->limit(rand(1, 3))
                ->pluck('id')
                ->toArray();

            foreach ($condicionesIds as $condicionId) {
                RelacionProveedorCondicion::firstOrCreate([
                    'id_proveedor' => $proveedor->id,
                    'id_iva' => $condicionId
                ]);
            }
        }
    }
}
