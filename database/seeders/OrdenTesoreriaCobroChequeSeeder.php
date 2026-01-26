<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroCheque;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaCobroChequeSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaCobroChequeSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::all();

        foreach ($ordenes as $orden) {

            // Solo órdenes de cobro
            if ($orden->tipo !== 'cobro') {
                continue;
            }

            OrdenTesoreriaCobroCheque::create([
                'orden_tesoreria_id' => $orden->id,
                'banco_emisor_id'    => rand(1, 10),
                'banco_destino_id'   => rand(1, 10),
                'cuenta_destino_id'  => rand(1, 10),
                'fecha_cheque'       => now(),
                'numero_cheque'      => 'CHQ-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'numero_operacion'   => 'CHQ-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
