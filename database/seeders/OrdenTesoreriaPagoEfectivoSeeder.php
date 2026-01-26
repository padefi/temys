<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\Contabilidad\OrdenTesoreriaPagoEfectivo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaPagoEfectivoSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaPagoEfectivoSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::where('tipo', 'pago')->get();

        foreach ($ordenes as $orden) {

            OrdenTesoreriaPagoEfectivo::create([
                'orden_tesoreria_id' => $orden->id,
                'numero_operacion'   => 'EF-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
