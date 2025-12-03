<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventarioMovimientoEstadosSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventario_movimiento_estados')->insert([
            [
                'transito_id' => 1,
                'estado'        => 'pendiente',
                'usuario_id'    => 1,
                'fecha'         => now()->subDays(2),
                'observacion'   => 'Movimiento creado y pendiente de aprobación.',
            ],
            [
                'transito_id' => 2,
                'estado'        => 'en_transito',
                'usuario_id'    => 2,
                'fecha'         => now()->subDay(),
                'observacion'   => 'Camión salió del depósito central rumbo a sucursal.',
            ],
            [
                'transito_id' => 3,
                'estado'        => 'completado',
                'usuario_id'    => 3,
                'fecha'         => now(),
                'observacion'   => 'Recepción confirmada por el encargado de almacén destino.',
            ],
        ]);
    }
}
