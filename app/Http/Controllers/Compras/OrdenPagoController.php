<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\Compras\PlanPago;
use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrdenPagoController extends Controller
{
    ////GUARDAR ORDEN DE PAGO
    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo_pago' => 'required|in:Unico,Cuotas',
            'cantidad_cuotas' => 'nullable|integer|min:1',
            'facturasSeleccionadas' => 'required|array|min:1',
            'pagos' => 'required|array|min:1',
            'pagos.*.metodo_pago_id' => 'required|integer',
            'pagos.*.moneda_id' => 'required|integer',
            'pagos.*.importe' => 'required|numeric|min:0',
            'pagos.*.fecha_pago' => 'required|date',
            'pagos.*.banco_origen_id' => 'nullable|integer',
            'pagos.*.cuenta_origen_id' => 'nullable|integer',
            'pagos.*.tarjeta_origen_id' => 'nullable|integer',
            'pagos.*.cbu_pago' => 'nullable|string',
            'pagos.*.usuario_id' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            // 🔹 Crear plan de pago
            $plan = PlanPago::create([
                'tipo_pago' => $data['tipo_pago'],
                'cantidad_cuotas' => $data['tipo_pago'] === 'Cuotas'
                    ? $data['cantidad_cuotas']
                    : null,
            ]);

            // 🔹 Crear cada orden de pago asociada al plan
            $ordenes = [];
            foreach ($data['pagos'] as $pagoData) {
                $ordenes[] = OrdenPago::create([
                    'plan_pago_id' => $plan->id,
                    'metodo_pago_id' => $pagoData['metodo_pago_id'],
                    'moneda_id' => $pagoData['moneda_id'],
                    'importe' => $pagoData['importe'],
                    'fecha_pago' => $pagoData['fecha_pago'],
                    'banco_origen_id' => $pagoData['banco_origen_id'] ?? null,
                    'cuenta_origen_id' => $pagoData['cuenta_origen_id'] ?? null,
                    'tarjeta_origen_id' => $pagoData['tarjeta_origen_id'] ?? null,
                    'cbu_pago' => $pagoData['cbu_pago'] ?? null,
                    'usuario_creacion' => $pagoData['usuario_id'],
                ]);
            }

            // 🔹 Asociar facturas al plan
            $facturaIds = collect($data['facturasSeleccionadas'])->pluck('id')->toArray();
            $plan->comprobantesProveedores()->attach($facturaIds);

            // 🔹 Distribuir proporcionalmente las facturas en cada orden
            $totalFacturas = collect($data['facturasSeleccionadas'])->sum('montoAPagar');
            $facturas = collect($data['facturasSeleccionadas']);

            foreach ($ordenes as $orden) {
                foreach ($facturas as $factura) {
                    $proporcion = $factura['montoAPagar'] / $totalFacturas;
                    $importeAplicado = round($orden->importe * $proporcion, 2);

                    DB::table('relacion_comprobante_orden_pago_proveedores')->insert([
                        'comprobante_id' => $factura['id'],
                        'orden_pago_id' => $orden->id,
                        'importe_aplicado' => $importeAplicado,
                        'fecha_aplicacion' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Plan de pago y órdenes creadas correctamente con distribución proporcional',
                'plan_pago' => $plan,
                'ordenes_pago' => $ordenes,
            ], 201);

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al guardar la orden de pago: ' . $th->getMessage());
            return response()->json([
                'error' => 'Error al guardar la orden de pago',
                'details' => $th->getMessage(),
            ], 500);
        }
    }

    ////ACTUALIZAR ORDEN DE PAGO
    public function guardarOrdenes(Request $request)
    {
        foreach ($request->ordenes as $ordenData) {
            $orden = OrdenPago::find($ordenData['id']);
            if (!$orden) continue;

            $orden->update([
                'metodo_pago_id' => $ordenData['metodo_pago_id'] ?? $orden->metodo_pago_id,
                'banco_origen_id' => $ordenData['banco_origen_id'] ?? $orden->banco_origen_id,
                'cuenta_origen_id' => $ordenData['cuenta_origen_id'] ?? $orden->cuenta_origen_id,
                'tarjeta_origen_id' => $ordenData['tarjeta_origen_id'] ?? $orden->tarjeta_origen_id,
                'cbu_pago' => $ordenData['cbu_pago'] ?? $orden->cbu_pago,
            ]);
        }



        return response()->json(['message' => 'Órdenes actualizadas correctamente']);
    }

    ////PROCESAR ORDEN DE PAGO
    public function procesarOrdenes(Request $request)
    {
        $request->validate([
            'ordenes' => 'required|array|min:1',
            'ordenes.*.id' => 'required|integer|exists:orden_pago_proveedores,id',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->ordenes as $ordenData) {
                $orden = OrdenPago::findOrFail($ordenData['id']);

                // Marcar la orden como procesada
                $orden->update([
                    'estado' => 'Confirmado',
                    'fecha_pago' => now(),
                    'usuario_pago' => User::first()->id,
                ]);



                // Crear movimiento de tesorería
                MovimientoTesoreria::create([
                    'fecha' => now(),
                    'tipo_movimiento' => 'salida',
                    'monto' => $ordenData['importe'],
                    'metodo_pago_id' => $ordenData['metodo_pago_id'] ?? null,
                    'tipo_moneda_id' => $ordenData['moneda_id'] ?? null,
                    'banco_id' => $ordenData['banco_origen_id'] ?? null,
                    'cuenta_bancaria_id' => $ordenData['cuenta_origen_id'] ?? null,
                    'orden_pago_id' => $orden->id,
                    'proveedor_id' => $ordenData['proveedor_id'] ?? null,
                    'usuario_id' => User::first()->id,
                    'descripcion' => "Pago de Orden #{$orden->id}",
                    'referencia_bancaria' => $ordenData['cbu_pago'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Órdenes procesadas y registradas en tesorería correctamente']);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['error' => 'Error al procesar las órdenes'], 500);
        }
    }

}
