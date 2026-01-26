<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\ComprobanteDetalle;
use App\Models\Contabilidad\ComprobanteDetalleImpuesto;
use App\Models\General\Impuesto;
use App\Models\General\CondicionVenta ;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\General\UnidadMedida;
use App\Models\Inventario\Productos\Producto;

class ComprobanteSeeder extends Seeder
{

    private function nextNumeroFactura(
        string $tipo,
        int $tipoId,
        int $tipoComprobanteId,
        string $puntoVenta
    ): int {
        return Comprobante::where([
            'tipo' => $tipo,
            'tipo_id' => $tipoId,
            'tipo_comprobante_id' => $tipoComprobanteId,
            'punto_venta' => $puntoVenta,
        ])->max('numero_factura') + 1 ?? 1;
    }

    public function run(): void
    {
        $usuario = User::first(); // Usuario de ejemplo
        $condicionVenta = CondicionVenta::first(); // Condición de venta de ejemplo
        $tipoComprobante = TipoComprobante::first(); // Tipo de comprobante de ejemplo
        $impuestos = Impuesto::all()->take(2); // Ejemplo: dos impuestos
        $monedas = TipoMoneda::all()->take(2); // Ejemplo: dos TipoMoneda

        $proveedores = \App\Models\Padron\Proveedor\Proveedor::all();
        $clientes = \App\Models\Padron\Cliente\Cliente::all();

        $producto = Producto::query()->inRandomOrder()->first();

        foreach ($proveedores as $proveedor) {

    foreach (['Factura A', 'Recibo'] as $tipo) {

        $numeroFactura = $this->nextNumeroFactura(
            'proveedor',
            $proveedor->id,
            $tipoComprobante->id,
            '0001'
        );

        $comp = Comprobante::create([
            'tipo' => 'proveedor',
            'tipo_id' => $proveedor->id,
            'fecha_factura' => now(),
            'fecha_vencimiento' => now()->addDays(30),
            'condicion_venta_id' => $condicionVenta->id,
            'punto_venta' => '0001',
            'numero_factura' => $numeroFactura,
            'moneda_id' => $monedas->random()->id,
            'tipo_comprobante_id' => $tipoComprobante->id,
            'estado' => 'Pendiente',
            'descripcion' => 'Comprobante de prueba',
            'usuario_creacion' => $usuario->id,
        ]);

        for ($i = 1; $i <= 2; $i++) {
            $detalle = ComprobanteDetalle::create([
                'comprobante_id' => $comp->id,
                'producto_id' => $producto->id,
                'descripcion' => "Producto $i",
                'modelo' => "MOD$i",
                'unidad_medida_id' => UnidadMedida::first()->id,
                'cantidad' => 5 * $i,
                'precio_unitario' => 100 * $i,
                'porcentaje_descuento' => 10,
                'co_cuenta_id' => CuentaBancaria::first()->id,
                'importe' => 5 * $i * 100 * $i * 0.9,
                'usuario_creacion' => $usuario->id,
            ]);

            foreach ($impuestos as $impuesto) {
                ComprobanteDetalleImpuesto::create([
                    'detalle_id' => $detalle->id,
                    'impuesto_id' => $impuesto->id,
                ]);
            }
        }
    }
}


    foreach ($clientes as $cliente) {

    foreach (['Factura A', 'Recibo'] as $tipo) {

        $numeroFactura = $this->nextNumeroFactura(
            'cliente',
            $cliente->id,
            $tipoComprobante->id,
            '0001'
        );

        $comp = Comprobante::create([
            'tipo' => 'cliente',
            'tipo_id' => $cliente->id,
            'fecha_factura' => now(),
            'fecha_vencimiento' => now()->addDays(30),
            'condicion_venta_id' => $condicionVenta->id,
            'punto_venta' => '0001',
            'numero_factura' => $numeroFactura,
            'moneda_id' => $monedas->random()->id,
            'tipo_comprobante_id' => $tipoComprobante->id,
            'estado' => 'Pendiente',
            'descripcion' => 'Comprobante de prueba',
            'usuario_creacion' => $usuario->id,
        ]);

        for ($i = 1; $i <= 2; $i++) {
            $detalle = ComprobanteDetalle::create([
                'comprobante_id' => $comp->id,
                'producto_id' => $producto->id,
                'descripcion' => "Producto $i",
                'modelo' => "MOD$i",
                'unidad_medida_id' => UnidadMedida::first()->id,
                'cantidad' => 5 * $i,
                'precio_unitario' => 100 * $i,
                'porcentaje_descuento' => 10,
                'co_cuenta_id' => CuentaBancaria::first()->id,
                'importe' => 5 * $i * 100 * $i * 0.9,
                'usuario_creacion' => $usuario->id,
            ]);

            foreach ($impuestos as $impuesto) {
                ComprobanteDetalleImpuesto::create([
                    'detalle_id' => $detalle->id,
                    'impuesto_id' => $impuesto->id,
                ]);
            }
        }
    }
}


    }
}
