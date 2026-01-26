<?php

namespace Database\Seeders;

use App\Models\Contabilidad\RelacionComprobanteComprobante;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contabilidad\Comprobante;

class RelacionComprobanteComprobanteSeeder extends Seeder
{
    public function run(): void
    {
        $anticipos = Comprobante::whereHas('tipoComprobante', function ($q) {
            $q->where('categoria', 'anticipo');
        })->get();

        $facturas = Comprobante::whereHas('tipoComprobante', function ($q) {
            $q->where('categoria', 'factura');
        })->get();

        foreach ($anticipos as $anticipo) {
            $factura = $facturas->random();

            RelacionComprobanteComprobante::create([
                'comprobante_origen_id' => $anticipo->id,
                'comprobante_destino_id' => $factura->id,
                'importe_aplicado' => rand(1000, 10000),
                'fecha_aplicacion' => now(),
            ]);
        }
    }
}
