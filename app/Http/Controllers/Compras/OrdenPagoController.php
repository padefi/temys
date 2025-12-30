<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\Compras\PlanPago;
use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use App\Models\General\MetodoPago;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrdenPagoController extends Controller
{

    ////GUARDAR ORDEN DE PAGO
    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo_pago' => 'required|in:Unico,Cuotas,Anticipos',
            'cantidad_cuotas' => 'nullable|integer|min:1',
            'facturasSeleccionadas' => 'required|array|min:1',

            // Cada factura debe ser objeto con id + montoAPagar
            'facturasSeleccionadas' => 'required|array|min:1',
            'facturasSeleccionadas.*.id' => 'required|integer',
            'facturasSeleccionadas.*.montoAPagar' => 'required|numeric|min:0',

            'anticipos_aplicados' => 'nullable|array',
            'anticipos_aplicados.*.factura_id' => 'required|integer',
            'anticipos_aplicados.*.anticipo_id' => 'required|integer',
            'anticipos_aplicados.*.importe' => 'required|numeric|min:0',

            // 👇 pagos solo requeridos si NO es Anticipos
            'pagos' => 'required_if:tipo_pago,Unico,Cuotas|array',
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

            // 🟢 CASO: SOLO ANTICIPOS (sin orden de pago)
            if ($data['tipo_pago'] === 'Anticipos') {

                if (!empty($data['anticipos_aplicados'])) {
                    foreach ($data['anticipos_aplicados'] as $aplicacion) {

                        if ($aplicacion['importe'] <= 0) {
                            continue;
                        }

                        DB::table('relacion_comprobante_comprobante_proveedores')->insert([
                            'comprobante_origen_id' => $aplicacion['anticipo_id'], // anticipo
                            'comprobante_destino_id' => $aplicacion['factura_id'], // factura
                            'importe_aplicado' => $aplicacion['importe'],
                            'fecha_aplicacion' => now(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                DB::commit();

                return response()->json([
                    'message' => 'Anticipos aplicados correctamente',
                ], 201);
            }

            // 🟢 CASO: Plan Único y Cuotas (sin orden de pago)
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
            $facturaIds = collect($data['facturasSeleccionadas'])
                ->pluck('id')
                ->toArray();

            $plan->comprobantesProveedores()->attach($facturaIds);

            // 🔹 Distribución proporcional de facturas en cada órden
            $facturas = collect($data['facturasSeleccionadas']);
            $totalFacturas = $facturas->sum('montoAPagar');

            $totalAnticipos = collect($data['anticipos_aplicados'])->sum('importe');

            if ($data['tipo_pago'] === 'Anticipos' && round($totalFacturas - $totalAnticipos, 2) !== 0.00) {
                throw new \Exception('Los anticipos no cubren el total de las facturas');
            }

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

            //////ACA CARGA LOS ANTICIPOS APLICADOS A LAS FACTURAS
            if (!empty($data['anticipos_aplicados'])) {

                foreach ($data['anticipos_aplicados'] as $aplicacion) {

                    // 🔹 Validaciones defensivas
                    if ($aplicacion['importe'] <= 0) {
                        continue;
                    }

                    DB::table('relacion_comprobante_comprobante_proveedores')->insert([
                        'comprobante_origen_id' => $aplicacion['anticipo_id'],
                        'comprobante_destino_id' => $aplicacion['factura_id'],
                        'importe_aplicado' => $aplicacion['importe'],
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

    //// PROCESAR ORDEN DE PAGO
    public function procesarOrdenes(Request $request)
    {
        $request->validate([
            'ordenes' => 'required|array|min:1',
            'ordenes.*.id' => 'required|integer|exists:orden_pago_proveedores,id',
        ]);

        DB::beginTransaction();

        try {
            // Ejercicio contable abierto
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();
            $usuarioId = Auth::id() ?? User::first()->id;

            foreach ($request->ordenes as $ordenData) {

                // --------- 1. OBTENER ORDEN ----------
                $orden = OrdenPago::findOrFail($ordenData['id']);

                // --------- 2. MARCAR COMO PAGADA ----------
                $orden->update([
                    'estado'      => 'Confirmado',
                    'fecha_pago'  => now(),
                    'usuario_pago'=> $usuarioId,
                ]);

                // --------- 3. MOVIMIENTO DE TESORERÍA ----------
                MovimientoTesoreria::create([
                    'fecha'               => now(),
                    'tipo_movimiento'     => 'salida',
                    'monto'               => $ordenData['importe'],
                    'metodo_pago_id'      => $ordenData['metodo_pago_id'] ?? null,
                    'tipo_moneda_id'      => $ordenData['moneda_id'] ?? null,
                    'banco_id'            => $ordenData['banco_origen_id'] ?? null,
                    'cuenta_bancaria_id'  => $ordenData['cuenta_origen_id'] ?? null,
                    'orden_pago_id'       => $orden->id,
                    'proveedor_id'        => $ordenData['proveedor_id'] ?? null,
                    'usuario_id'          => $usuarioId,
                    'descripcion'         => "Pago de Orden #{$orden->id}",
                    'referencia_bancaria' => $ordenData['cbu_pago'] ?? null,
                ]);

                // --------- 4. CUENTAS CONTABLES ----------
                $proveedor = Proveedor::find($ordenData['proveedor_id']);
                $metodo    = MetodoPago::find($ordenData['metodo_pago_id']);

                $cuentaProveedor = 274; // DEBE
                $cuentaMetodo    = $metodo->co_cuenta_id; // HABER

                // --------- 5. CREAR ASIENTO ----------
                $asiento = Asiento::create([
                    'numero'          => Asiento::max('numero') + 1,
                    'co_ejercicio_id' => $ejercicio->id,
                    'fecha'           => now(),
                    'concepto'        => "Pago Orden #{$orden->id}",
                    'estado'          => 'Pendiente',
                    'importe'         => $ordenData['importe'],
                    'model_id_created'=> $usuarioId,
                ]);

                // --------- 6. PARTIDA DEBE (Proveedor) ----------
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id'  => $cuentaProveedor,
                    'concepto'      => "Cancelación de deuda proveedor",
                    'debe'          => $ordenData['importe'],
                    'haber'         => 0,
                ]);

                // --------- 7. PARTIDA HABER (Método Pago) ----------
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id'  => $cuentaMetodo,
                    'concepto'      => "Pago mediante {$metodo->nombre}",
                    'debe'          => 0,
                    'haber'         => $ordenData['importe'],
                ]);


                // ====================================================
                // 8. IMPUESTOS ASOCIADOS A LAS FACTURAS ORIGEN
                // ====================================================
                $impuestosAgrupados = [];

                foreach ($orden->comprobantesProveedores as $comp) {

                    foreach ($comp->detalles as $detalle) {

                        foreach ($detalle->impuestos as $imp) {

                            $cuentaId = $imp->co_cuenta_id;
                            if (!$cuentaId) continue;

                            // Buscar si en la pivote existe un monto ya calculado
                            $pivot = DB::table('comprobantes_proveedores_detalles_impuestos')
                                        ->where('detalle_id', $detalle->id)
                                        ->where('impuesto_id', $imp->id)
                                        ->first();

                            // ------------- CALCULAR IMPORTE DEL IMPUESTO ----------------

                                // Si la pivote no tiene importe, calcularlo:
                                // valor = base * porcentaje
                                $base = collect([
                                    $detalle->subtotal ?? null,
                                    $detalle->importe ?? null,
                                    $detalle->monto ?? null,
                                    $detalle->total ?? null,
                                    $detalle->precio_total ?? null,
                                ])->filter()->first() ?? 0;
                                $porcentaje = $imp->porcentaje ?? 0;

                                $importeImpuesto = $base * ($porcentaje / 100);


                            if ($importeImpuesto <= 0) continue;

                            // Agrupar por cuenta contable
                            if (!isset($impuestosAgrupados[$cuentaId])) {
                                $impuestosAgrupados[$cuentaId] = [
                                    'nombre'  => $imp->descripcion,
                                    'importe' => 0
                                ];
                            }

                            $impuestosAgrupados[$cuentaId]['importe'] += $importeImpuesto;
                        }
                    }
                }


                // ====================================================
                // 9. GENERAR PARTIDAS DE RETENCIONES / PERCEPCIONES
                // ====================================================
                foreach ($impuestosAgrupados as $cuentaId => $data) {
                    Partida::create([
                        'co_asiento_id' => $asiento->id,
                        'co_cuenta_id'  => $cuentaId,
                        'concepto'      => "Percepción/Impuesto: {$data['nombre']}",
                        'debe'          => 0,
                        'haber'         => $data['importe'], // LAS RETENCIONES VAN AL HABER
                    ]);
                }

            }

            DB::commit();

            return response()->json(['message' => 'Órdenes procesadas correctamente']);

        } catch (\Throwable $e) {

            DB::rollBack();
            report($e);

            return response()->json([
                'error'   => 'Error al procesar las órdenes',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }



}
