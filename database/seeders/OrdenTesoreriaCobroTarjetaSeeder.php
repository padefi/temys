<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroTarjeta;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaCobroTarjetaSeeder extends Seeder
{
     public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaCobroTarjetaSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::all();

        foreach ($ordenes as $orden) {

            // Solo para órdenes de cobro (si aplica a tu lógica)
            if ($orden->tipo !== 'cobro') {
                continue;
            }

            OrdenTesoreriaCobroTarjeta::create([
                'orden_tesoreria_id' => $orden->id,
                'numero_operacion'   => 'OP-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
