<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroTransferencia;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaCobroTransferenciaSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaCobroTransferenciaSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::all();

        foreach ($ordenes as $orden) {

            // Solo órdenes de cobro (ajustá si tu lógica usa otro campo)
            if ($orden->tipo !== 'cobro') {
                continue;
            }

            OrdenTesoreriaCobroTransferencia::create([
                'orden_tesoreria_id' => $orden->id,
                'numero_operacion'   => 'TRX-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
