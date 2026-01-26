<?php

namespace Database\Seeders;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaPagoTarjeta;
use App\Models\ControlAcceso\User;
use App\Models\General\Tarjeta;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdenTesoreriaPagoTarjetaSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first();
        $tarjetas = Tarjeta::all();

        if (!$usuario || $tarjetas->isEmpty()) {
            $this->command->warn(
                'No hay usuarios o tarjetas, se omite OrdenTesoreriaPagoTarjetaSeeder'
            );
            return;
        }

        $ordenes = OrdenTesoreria::where('tipo', 'pago')->get();

        foreach ($ordenes as $orden) {

            OrdenTesoreriaPagoTarjeta::create([
                'orden_tesoreria_id' => $orden->id,
                'tarjeta_origen_id'  => $tarjetas->random()->id,
                'numero_operacion'   => 'TARJ-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'usuario_creacion'   => $usuario->id,
            ]);
        }
    }
}
