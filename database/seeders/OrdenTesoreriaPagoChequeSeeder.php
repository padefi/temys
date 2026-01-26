<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\Cheque;
use App\Models\Contabilidad\OrdenTesoreriaPagoCheque;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaPagoChequeSeeder extends Seeder
{
     public function run(): void
    {
        $usuario = User::first();

        if (!$usuario) {
            $this->command->warn('No hay usuarios, se omite OrdenTesoreriaPagoChequeSeeder');
            return;
        }

        $ordenes = OrdenTesoreria::where('tipo', 'pago')->get();
        $cheques = Cheque::all();

        if ($cheques->isEmpty()) {
            $this->command->warn('No hay cheques, se omite OrdenTesoreriaPagoChequeSeeder');
            return;
        }

        foreach ($ordenes as $orden) {

            $cheque = $cheques->random();

            OrdenTesoreriaPagoCheque::create([
                'orden_tesoreria_id' => $orden->id,
                'cheque_id'          => $cheque->id,
                'numero_cheque'      => $cheque->numero ?? str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'fecha_cheque'       => $cheque->fecha_cheque,
                'numero_operacion'   => 'OP-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
