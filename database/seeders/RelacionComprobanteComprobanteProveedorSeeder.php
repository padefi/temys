<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\RelacionComprobanteComprobanteProveedor;
use App\Models\Compras\ComprobanteProveedor;

class RelacionComprobanteComprobanteProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $anticipos = ComprobanteProveedor::whereHas('tipoComprobante', function ($q) {
            $q->where('categoria', 'anticipo');
        })->get();

        $facturas = ComprobanteProveedor::whereHas('tipoComprobante', function ($q) {
            $q->where('categoria', 'factura');
        })->get();

        foreach ($anticipos as $anticipo) {
            $factura = $facturas->random();

            RelacionComprobanteComprobanteProveedor::create([
                'comprobante_origen_id' => $anticipo->id,
                'comprobante_destino_id' => $factura->id,
                'importe_aplicado' => rand(1000, 10000),
                'fecha_aplicacion' => now(),
            ]);
        }
    }
}
