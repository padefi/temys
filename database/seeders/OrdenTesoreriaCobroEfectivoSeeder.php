<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroEfectivo;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaCobroEfectivoSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaCobroEfectivoSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::all();

        foreach ($ordenes as $orden) {

            // Solo órdenes de COBRO
            if ($orden->tipo !== 'cobro') {
                continue;
            }

            OrdenTesoreriaCobroEfectivo::create([
                'orden_tesoreria_id' => $orden->id,
                'numero_operacion'   => 'EFE-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
