<?php

namespace Database\Seeders;

use App\Models\Ventas\ComprobanteCliente;
use App\Models\ControlAcceso\User;
use App\Models\General\CondicionVenta;
use App\Models\General\CuentaBancaria;
use App\Models\General\Impuesto;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\General\UnidadMedida;
use App\Models\Inventario\Productos\Producto;
use App\Models\Ventas\ComprobanteClienteDetalle;
use App\Models\Ventas\ComprobanteClienteDetalleImpuesto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ComprobanteClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usuario = User::first(); // Usuario de ejemplo
        $condicionVenta = CondicionVenta::first(); // Condición de venta de ejemplo
        $tipoComprobante = TipoComprobante::first(); // Tipo de comprobante de ejemplo
        $impuestos = Impuesto::all()->take(2); // Ejemplo: dos impuestos
        $monedas = TipoMoneda::all()->take(2); // Ejemplo: dos TipoMoneda

        $clientes = \App\Models\Padron\Cliente\Cliente::all();

        $producto = Producto::query()->inRandomOrder()->first();

        foreach ($clientes as $cliente) {
        // Crear 2 comprobantes
        foreach (['Factura A', 'Recibo'] as $tipo) {
            $comp = ComprobanteCliente::create([
                'cliente_id' => $cliente->id,
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
                $detalle = ComprobanteClienteDetalle::create([
                    'comprobante_cliente_id' => $comp->id,
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
                    ComprobanteClienteDetalleImpuesto::create([
                        'detalle_id' => $detalle->id,
                        'impuesto_id' => $impuesto->id,
                    ]);
                }
            }
        }
    }
    }
}
