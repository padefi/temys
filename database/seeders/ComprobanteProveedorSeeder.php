<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\ComprobanteProveedorDetalle;
use App\Models\Compras\ComprobanteProveedorDetalleImpuesto;
use App\Models\General\Impuesto;
use App\Models\General\CondicionVenta ;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\General\UnidadMedida;
use App\Models\Inventario\Productos\Producto;

class ComprobanteProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::first(); // Usuario de ejemplo
        $condicionVenta = CondicionVenta::first(); // Condición de venta de ejemplo
        $tipoComprobante = TipoComprobante::first(); // Tipo de comprobante de ejemplo
        $impuestos = Impuesto::all()->take(2); // Ejemplo: dos impuestos
        $monedas = TipoMoneda::all()->take(2); // Ejemplo: dos TipoMoneda

        $proveedores = \App\Models\Padron\Proveedor\Proveedor::all();

        $producto = Producto::query()->inRandomOrder()->first();

        foreach ($proveedores as $proveedor) {
        // Crear 2 comprobantes
        foreach (['Factura A', 'Recibo'] as $tipo) {
            $comp = ComprobanteProveedor::create([
                'proveedor_id' => $proveedor->id,
                'fecha_factura' => now(),
                'fecha_vencimiento' => now()->addDays(30),
                'condicion_venta_id' => $condicionVenta->id,
                'punto_venta' => '0001',
                'numero_factura' => rand(1000, 9999),
                'moneda_id' => $monedas->random()->id,
                'tipo_comprobante_id' => $tipoComprobante->id,
                'estado' => 'Pendiente',
                'descripcion' => 'Comprobante de prueba',
                'usuario_creacion' => $usuario->id,
            ]);

            // Crear 2 detalles por comprobante
            for ($i = 1; $i <= 2; $i++) {
                $detalle = ComprobanteProveedorDetalle::create([
                    'comprobante_proveedor_id' => $comp->id,
                    'producto_id' => $producto->id,
                    'descripcion' => "Producto $i",
                    'modelo' => "MOD$i",
                    'unidad_medida_id' => UnidadMedida::first()->id,
                    'cantidad' => 5 * $i,
                    'precio_unitario' => 100 * $i,
                    'porcentaje_descuento' => 10,
                    'co_cuenta_id' => CuentaBancaria::first()->id,
                    'importe' => 5 * $i * 100 * $i * 0.9, // aplica descuento
                    'usuario_creacion' => $usuario->id,
                ]);

                // Asociar impuestos al detalle
                foreach ($impuestos as $impuesto) {
                    ComprobanteProveedorDetalleImpuesto::create([
                        'detalle_id' => $detalle->id,
                        'impuesto_id' => $impuesto->id,
                    ]);
                }
            }
        }
    }
    }
}
