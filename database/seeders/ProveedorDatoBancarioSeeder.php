<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ProveedorDatoBancario;

class ProveedorDatoBancarioSeeder extends Seeder
{
    public function run(): void
    {
        Proveedor::all()->each(function ($proveedor) {
            // Siempre al menos uno
            ProveedorDatoBancario::factory()->create([
                'id_proveedor' => $proveedor->id,
                'predeterminado' => true,
            ]);

            // 50% chance de segundo dato bancario (ej: CVU)
            if (rand(0, 1)) {
                ProveedorDatoBancario::factory()->create([
                    'id_proveedor' => $proveedor->id,
                    'predeterminado' => false,
                ]);
            }
        });
    }
}

