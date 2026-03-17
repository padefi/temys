<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\CondicionIva;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\RelacionProveedorCondicion;
use App\Models\ControlAcceso\User;

class RelacionProveedorCondicionSeeder extends Seeder
{
    public function run()
    {
        $usuarioId = User::inRandomOrder()->value('id');
        //Asignar condiciones de IVA aleatorias a los proveedores
        $proveedores = \App\Models\Padron\Proveedor\Proveedor::all();

        foreach ($proveedores as $proveedor) {
            //Asignar 1-3 condiciones de IVA por proveedor
            $condicionesIds = CondicionIva::inRandomOrder()
                ->limit(rand(1, 3))
                ->pluck('id')
                ->toArray();

            foreach ($condicionesIds as $condicionId) {
                RelacionProveedorCondicion::firstOrCreate(
                    [
                      'id_proveedor' => $proveedor->id,
                      'id_iva' => $condicionId
                    ],
                    [
                      'fecha_creacion' => now(),
                      'usuario_creacion' => $usuarioId,
                    ]    
                );
            }
        }
    }
}
