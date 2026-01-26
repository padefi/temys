<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaPagoTransferencia;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\Padron\PadronCbu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaPagoTransferenciaSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaPagoTransferenciaSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::where('tipo', 'pago')->get();
        $cuentas = CuentaBancaria::all();
        $cbus = PadronCbu::all();

        if ($cuentas->isEmpty() || $cbus->isEmpty()) {
            $this->command->warn('Faltan cuentas bancarias o CBUs');
            return;
        }

        foreach ($ordenes as $orden) {

            $cbu = $cbus->random();

            OrdenTesoreriaPagoTransferencia::create([
                'orden_tesoreria_id'        => $orden->id,
                'cuenta_bancaria_origen_id'=> $cuentas->random()->id,
                'tipo'                     => $cbu->tipo, // cliente / proveedor
                'cbu_id'                   => $cbu->id,
                'numero_operacion'         => 'TR-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'         => $usuario->id,
            ]);
        }
    }
}
