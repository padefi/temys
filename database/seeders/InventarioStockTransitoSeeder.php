<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventarioStockTransitoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventario_stock_transito')->insert([
            [
                'movimiento_id'     => 1,
                'producto_id'       => 1,
                'origen_id'         => 1,
                'destino_id'        => 2,
                'cantidad'          => 50,
                'estado'            => 'pendiente',
                'ubicacion_actual'  => 'Depósito Central',
                'fecha_salida'      => now(),
                'fecha_llegada'     => null,
                'observaciones'     => 'Preparado para envío a sucursal norte',
            ],
            [
                'movimiento_id'     => 2,
                'producto_id'       => 3,
                'origen_id'         => 2,
                'destino_id'        => 3,
                'cantidad'          => 120,
                'estado'            => 'en_transito',
                'ubicacion_actual'  => 'En ruta - Camión 24',
                'fecha_salida'      => now()->subDays(1),
                'fecha_llegada'     => null,
                'observaciones'     => 'Salida programada ayer, llegada prevista mañana',
            ],
            [
                'movimiento_id'     => 3,
                'producto_id'       => 2,
                'origen_id'         => 1,
                'destino_id'        => 3,
                'cantidad'          => 30,
                'estado'            => 'recibido',
                'ubicacion_actual'  => 'Sucursal Oeste',
                'fecha_salida'      => now()->subDays(3),
                'fecha_llegada'     => now()->subDays(2),
                'observaciones'     => 'Entrega confirmada sin incidencias',
            ],
        ]);
    }
}
