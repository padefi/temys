<?php

namespace App\Http\Controllers\Ventas;

use App\Http\Controllers\Controller;
use App\Models\Contabilidad\Plan;
use App\Models\Ventas\OrdenCobro;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroCheque;
use App\Models\Contabilidad\OrdenTesoreriaCobroEfectivo;
use App\Models\Contabilidad\OrdenTesoreriaCobroTarjeta;
use App\Models\Contabilidad\OrdenTesoreriaCobroTransferencia;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use App\Models\General\Cheque;
use App\Models\General\MetodoTesoreria;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrdenCobroController extends Controller
{

    ////GUARDAR ORDEN DE COBRO
    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo' => 'required|in:Unico,Cuotas,Anticipos',
            'cantidad_cuotas' => 'nullable|integer|min:1',
            'facturasSeleccionadas' => 'required|array|min:1',

            // Cada factura debe ser objeto con id + montoACobrar
            'facturasSeleccionadas' => 'required|array|min:1',
            'facturasSeleccionadas.*.id' => 'required|integer',
            'facturasSeleccionadas.*.montoACobrar' => 'required|numeric|min:0',

            'anticipos_aplicados' => 'nullable|array',
            'anticipos_aplicados.*.factura_id' => 'required|integer',
            'anticipos_aplicados.*.anticipo_id' => 'required|integer',
            'anticipos_aplicados.*.importe' => 'required|numeric|min:0',

            // 👇 cobros solo requeridos si NO es Anticipos
            'cobros' => 'required_if:tipo,Unico,Cuotas|array',
            'cobros.*.metodo_id' => 'required|integer',
            'cobros.*.moneda_id' => 'required|integer',
            'cobros.*.importe' => 'required|numeric|min:0',
            'cobros.*.fecha' => 'required|date',
            'cobros.*.banco_emisor_id' => 'nullable|integer',
            'cobros.*.banco_deposito_id' => 'nullable|integer',
            'cobros.*.cuenta_deposito_id' => 'nullable|integer',
            'cobros.*.tarjeta_origen_id' => 'nullable|integer',
            'cobros.*.fecha_cheque' => 'nullable|date',
            'cobros.*.numero_cheque' => 'nullable|string',
            'cobros.*.cbu_cobro' => 'nullable|string',
            'cobros.*.usuario_id' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            // 🟢 CASO: SOLO ANTICIPOS (sin orden de cobro)
            if ($data['tipo'] === 'Anticipos') {

                if (!empty($data['anticipos_aplicados'])) {
                    foreach ($data['anticipos_aplicados'] as $aplicacion) {

                        if ($aplicacion['importe'] <= 0) {
                            continue;
                        }

                        DB::table('relacion_comprobante_comprobante')->insert([
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

            // =========================
            // 🟢 PLAN DE COBRO
            // =========================
            $plan = Plan::create([
                'tipo' => $data['tipo'],
                'cantidad_cuotas' => $data['tipo'] === 'Cuotas'
                    ? $data['cantidad_cuotas']
                    : null,
            ]);

            // =========================
            // 🟢 ÓRDENES DE TESORERÍA
            // =========================
            $ordenes = [];

            foreach ($data['cobros'] as $cobroData) {

                $orden = OrdenTesoreria::create([
                    'plan_id'          => $plan->id,
                    'metodo_id'        => $cobroData['metodo_id'],
                    'moneda_id'        => $cobroData['moneda_id'],
                    'importe'          => $cobroData['importe'],
                    'fecha'            => $cobroData['fecha'],
                    'estado'           => 'Pendiente',
                    'usuario_creacion' => $cobroData['usuario_id'],
                ]);

                // 👇 Detalle según medio de pago
                $this->crearDetalleCobro($orden, $cobroData);

                $ordenes[] = $orden;
            }

            // 🔹 Asociar facturas al plan
            $facturaIds = collect($data['facturasSeleccionadas'])
                ->pluck('id')
                ->toArray();

            $plan->comprobantes()->attach($facturaIds);

            // 🔹 Distribución proporcional de facturas en cada órden
            $facturas = collect($data['facturasSeleccionadas']);
            $totalFacturas = $facturas->sum('montoACobrar');

            $totalAnticipos = collect($data['anticipos_aplicados'])->sum('importe');

            if ($data['tipo'] === 'Anticipos' && round($totalFacturas - $totalAnticipos, 2) !== 0.00) {
                throw new \Exception('Los anticipos no cubren el total de las facturas');
            }

            foreach ($ordenes as $orden) {

                foreach ($facturas as $factura) {

                    $proporcion = $factura['montoACobrar'] / $totalFacturas;
                    $importeAplicado = round($orden->importe * $proporcion, 2);

                    DB::table('relacion_comprobante_orden_tesoreria')->insert([
                        'comprobante_id' => $factura['id'],
                        'orden_tesoreria_id' => $orden->id,
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

                    DB::table('relacion_comprobante_comprobante_clientes')->insert([
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
                'message' => 'Plan de cobro y órdenes creadas correctamente con distribución proporcional',
                'plan_cobro' => $plan,
                'ordenes_cobro' => $ordenes,
            ], 201);

        } catch (\Throwable $th) {

            DB::rollBack();
            Log::error('Error al guardar la orden de cobro: ' . $th->getMessage());

            return response()->json([
                'error' => 'Error al guardar la orden de cobro',
                'details' => $th->getMessage(),
            ], 500);
        }
    }


    ////CREA EL DETALLE DE LA ORDEN DE TESORERIA
    private function crearDetalleCobro(OrdenTesoreria $orden, array $cobroData): void
    {
        $metodo = MetodoTesoreria::findOrFail($orden->metodo_id);

        switch ($metodo->nombre) {

            case 'Efectivo':
                OrdenTesoreriaCobroEfectivo::create([
                    'orden_tesoreria_id' => $orden->id,
                    'numero_operacion'   => $cobroData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $cobroData['usuario_id'],
                ]);
                break;

            case 'Transferencia':
                OrdenTesoreriaCobroTransferencia::create([
                    'orden_tesoreria_id'        => $orden->id,
                    'cuenta_bancaria_deposito_id' => $cobroData['cuenta_deposito_id'],
                    'numero_operacion'          => $cobroData['numero_operacion'] ?? null,
                    'usuario_creacion'          => $cobroData['usuario_id'],
                ]);
                break;

            case 'Tarjeta':
                OrdenTesoreriaCobroTarjeta::create([
                    'orden_tesoreria_id' => $orden->id,
                    'tarjeta_origen_id'  => $cobroData['tarjeta_origen_id'],
                    'numero_operacion'   => $cobroData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $cobroData['usuario_id'],
                ]);
                break;

            case 'Cheque':

            if (empty($cobroData['cuenta_deposito_id'])) {
                throw new \Exception('La cuenta bancaria es obligatoria para pagos con cheque');
            }

            DB::transaction(function () use ($orden, $cobroData) {

                // 🔹 Bloquear últimos cheques de la cuenta para evitar duplicados
                $ultimoNumero = Cheque::where('cuenta_bancaria_id', $cobroData['cuenta_deposito_id'])
                    ->lockForUpdate()
                    ->max('numero');

                $nuevoNumero = ($ultimoNumero ?? 0) + 1;

                // 🔹 Crear cheque
                $cheque = Cheque::create([
                    'cuenta_bancaria_id' => $cobroData['cuenta_deposito_id'],
                    'numero'             => $nuevoNumero,
                ]);

                // 🔹 Asociar a la orden
                OrdenTesoreriaCobroCheque::create([
                    'orden_tesoreria_id' => $orden->id,
                    'cheque_id'          => $cheque->id,
                    'numero_cheque'      => $nuevoNumero,
                    'numero_cheque'       => $cobroData['numero_cheque'] ?? null,
                    'banco_emisor_id'       => $cobroData['banco_emisor_id'] ?? null,
                    'banco_deposito_id'       => $cobroData['banco_deposito_id'] ?? null,
                    'cuenta_deposito_id'       => $cobroData['cuenta_deposito_id'] ?? null,
                    'fecha_cheque'       => $cobroData['fecha_cheque'] ?? null,
                    'numero_operacion'   => $cobroData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $cobroData['usuario_id'],
                ]);
            });

            break;

            default:
                throw new \Exception("Método de pago no soportado: {$metodo->codigo}");
        }
    }


    ////ACTUALIZAR ORDEN DE COBRO
    public function guardarOrdenes(Request $request)
    {
        foreach ($request->ordenes as $ordenData) {
            $orden = OrdenTesoreria::find($ordenData['id']);
            if (!$orden) continue;

            $orden->update([
                'metodo_id' => $ordenData['metodo_id'] ?? $orden->metodo_id,
                'banco_origen_id' => $ordenData['banco_origen_id'] ?? $orden->banco_origen_id,
                'cuenta_origen_id' => $ordenData['cuenta_origen_id'] ?? $orden->cuenta_origen_id,
                'tarjeta_origen_id' => $ordenData['tarjeta_origen_id'] ?? $orden->tarjeta_origen_id,
                'cbu_cobro' => $ordenData['cbu_cobro'] ?? $orden->cbu_cobro,
            ]);
        }



        return response()->json(['message' => 'Órdenes actualizadas correctamente']);
    }

    //// PROCESAR ORDEN DE COBRO
    public function procesarOrdenes(Request $request)
    {
        $request->validate([
            'ordenes' => 'required|array|min:1',
            'ordenes.*.id' => 'required|integer|exists:orden_tesoreria,id',
        ]);

        DB::beginTransaction();

        try {
            // Ejercicio contable abierto
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();
            $usuarioId = Auth::id() ?? User::first()->id;

            foreach ($request->ordenes as $ordenData) {

                // --------- 1. OBTENER ORDEN ----------
                $orden = OrdenTesoreria::findOrFail($ordenData['id']);

                // --------- 2. MARCAR COMO PAGADA ----------
                $orden->update([
                    'estado'      => 'Confirmado',
                    'fecha'  => now(),
                    'usuario_aprobacion'=> $usuarioId,
                ]);

                // --------- 3. MOVIMIENTO DE TESORERÍA ----------
                MovimientoTesoreria::create([
                    'fecha'               => now(),
                    'tipo_movimiento'     => 'entrada',
                    'monto'               => $ordenData['importe'],
                    'metodo_id'           => $ordenData['metodo_id'] ?? null,
                    'tipo_moneda_id'      => $ordenData['moneda_id'] ?? null,
                    'banco_id'            => $ordenData['banco_origen_id'] ?? null,
                    'cuenta_bancaria_id'  => $ordenData['cuenta_origen_id'] ?? null,
                    'orden_tesoreria_id'  => $orden->id,
                    'tipo_id'             => $ordenData['tipo_id'] ?? null,
                    'usuario_id'          => $usuarioId,
                    'descripcion'         => "Cobro de Orden #{$orden->id}",
                    'referencia_bancaria' => $ordenData['cbu_cobro'] ?? null,
                ]);

                // --------- 4. CUENTAS CONTABLES ----------
                $cliente = Cliente::find($ordenData['tipo_id']);
                $metodo    = MetodoTesoreria::find($ordenData['metodo_id']);

                $cuentaCliente = 274; // DEBE
                $cuentaMetodo    = $metodo->co_cuenta_id; // HABER

                // --------- 5. CREAR ASIENTO ----------
                $asiento = Asiento::create([
                    'numero'          => Asiento::max('numero') + 1,
                    'co_ejercicio_id' => $ejercicio->id,
                    'fecha'           => now(),
                    'concepto'        => "Cobro Orden #{$orden->id}",
                    'estado'          => 'Pendiente',
                    'importe'         => $ordenData['importe'],
                    'model_id_created'=> $usuarioId,
                ]);

                // --------- 6. PARTIDA DEBE (Cliente) ----------
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id'  => $cuentaCliente,
                    'concepto'      => "Cobro de Orden #{$orden->id} por {$cliente->nombre}",
                    'debe'          => $ordenData['importe'],
                    'haber'         => 0,
                ]);

                // --------- 7. PARTIDA HABER (Método Pago) ----------
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id'  => $cuentaMetodo,
                    'concepto'      => "Cobro mediante {$metodo->nombre}",
                    'debe'          => 0,
                    'haber'         => $ordenData['importe'],
                ]);


                // ====================================================
                // 8. IMPUESTOS ASOCIADOS A LAS FACTURAS ORIGEN
                // ====================================================
                $impuestosAgrupados = [];

                foreach ($orden->comprobantes as $comp) {

                    foreach ($comp->detalles as $detalle) {

                        foreach ($detalle->impuestos as $imp) {

                            $cuentaId = $imp->co_cuenta_id;
                            if (!$cuentaId) continue;

                            // Buscar si en la pivote existe un monto ya calculado
                            $pivot = DB::table('comprobantes_detalles_impuestos')
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
