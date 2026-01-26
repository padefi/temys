<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\Compras\PlanPago;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaPagoCheque;
use App\Models\Contabilidad\OrdenTesoreriaPagoEfectivo;
use App\Models\Contabilidad\OrdenTesoreriaPagoTarjeta;
use App\Models\Contabilidad\OrdenTesoreriaPagoTransferencia;
use App\Models\Contabilidad\Plan;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use App\Models\General\Cheque;
use App\Models\General\MetodoPago;
use App\Models\General\MetodoTesoreria;
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
            'tipo' => 'required|in:Unico,Cuotas,Anticipos',
            'cantidad_cuotas' => 'nullable|integer|min:1',

            'facturasSeleccionadas' => 'required|array|min:1',
            'facturasSeleccionadas.*.id' => 'required|integer',
            'facturasSeleccionadas.*.montoAPagar' => 'required|numeric|min:0',

            'anticipos_aplicados' => 'nullable|array',
            'anticipos_aplicados.*.factura_id' => 'required|integer',
            'anticipos_aplicados.*.anticipo_id' => 'required|integer',
            'anticipos_aplicados.*.importe' => 'required|numeric|min:0',

            'pagos' => 'required_if:tipo,Unico,Cuotas|array',
            'pagos.*.metodo_id' => 'required|integer',
            'pagos.*.moneda_id' => 'required|integer',
            'pagos.*.importe' => 'required|numeric|min:0',
            'pagos.*.fecha' => 'required|date',
            'pagos.*.usuario_id' => 'required|integer',

            // Campos opcionales según método
            'pagos.*.cuenta_origen_id' => 'nullable|integer',
            'pagos.*.tarjeta_origen_id' => 'nullable|integer',
            'pagos.*.cheque_id' => 'nullable|integer',
            'pagos.*.numero_cheque' => 'nullable|string',
            'pagos.*.fecha_cheque' => 'nullable|date',
            'pagos.*.cbu_id' => 'nullable|integer',
            'pagos.*.numero_operacion' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            // =========================
            // 🟢 SOLO ANTICIPOS
            // =========================
            if ($data['tipo'] === 'Anticipos') {

                foreach ($data['anticipos_aplicados'] ?? [] as $aplicacion) {

                    if ($aplicacion['importe'] <= 0) continue;

                    DB::table('relacion_comprobante_comprobante')->insert([
                        'comprobante_origen_id'  => $aplicacion['anticipo_id'],
                        'comprobante_destino_id' => $aplicacion['factura_id'],
                        'importe_aplicado'       => $aplicacion['importe'],
                        'fecha_aplicacion'       => now(),
                        'created_at'             => now(),
                        'updated_at'             => now(),
                    ]);
                }

                DB::commit();
                return response()->json(['message' => 'Anticipos aplicados correctamente'], 201);
            }

            // =========================
            // 🟢 PLAN DE PAGO
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

            foreach ($data['pagos'] as $pagoData) {

                $orden = OrdenTesoreria::create([
                    'plan_id'          => $plan->id,
                    'metodo_id'        => $pagoData['metodo_id'],
                    'moneda_id'        => $pagoData['moneda_id'],
                    'importe'          => $pagoData['importe'],
                    'fecha'            => $pagoData['fecha'],
                    'estado'           => 'Pendiente',
                    'usuario_creacion' => $pagoData['usuario_id'],
                ]);

                // 👇 Detalle según medio de pago
                $this->crearDetallePago($orden, $pagoData);

                $ordenes[] = $orden;
            }

            // =========================
            // 🟢 ASOCIAR FACTURAS
            // =========================
            $facturas = collect($data['facturasSeleccionadas']);
            $totalFacturas = $facturas->sum('montoAPagar');

            foreach ($ordenes as $orden) {
                foreach ($facturas as $factura) {

                    $proporcion = $factura['montoAPagar'] / $totalFacturas;
                    $importeAplicado = round($orden->importe * $proporcion, 2);

                    DB::table('relacion_comprobante_orden_tesoreria')->insert([
                        'orden_tesoreria_id' => $orden->id,
                        'comprobante_id'     => $factura['id'],
                        'importe_aplicado'   => $importeAplicado,
                        'fecha_aplicacion'   => now(),
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ]);
                }
            }

            // =========================
            // 🟢 ANTICIPOS A FACTURAS
            // =========================
            foreach ($data['anticipos_aplicados'] ?? [] as $aplicacion) {

                if ($aplicacion['importe'] <= 0) continue;

                DB::table('relacion_comprobante_comprobante')->insert([
                    'comprobante_origen_id'  => $aplicacion['anticipo_id'],
                    'comprobante_destino_id' => $aplicacion['factura_id'],
                    'importe_aplicado'       => $aplicacion['importe'],
                    'fecha_aplicacion'       => now(),
                    'created_at'             => now(),
                    'updated_at'             => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Plan y órdenes creadas correctamente',
                'plan'    => $plan,
                'ordenes' => $ordenes,
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();
            Log::error($e);

            return response()->json([
                'error' => 'Error al crear la orden',
                'detail'=> $e->getMessage(),
            ], 500);
        }
    }

    ////CREA EL DETALLE DE LA ORDEN DE TESORERIA
    private function crearDetallePago(OrdenTesoreria $orden, array $pagoData): void
    {
        $metodo = MetodoTesoreria::findOrFail($orden->metodo_id);

        switch ($metodo->nombre) {

            case 'Efectivo':
                OrdenTesoreriaPagoEfectivo::create([
                    'orden_tesoreria_id' => $orden->id,
                    'numero_operacion'   => $pagoData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $pagoData['usuario_id'],
                ]);
                break;

            case 'Transferencia':
                OrdenTesoreriaPagoTransferencia::create([
                    'orden_tesoreria_id'        => $orden->id,
                    'cuenta_bancaria_origen_id' => $pagoData['cuenta_origen_id'],
                    'cbu_id'                    => $pagoData['cbu_id'],
                    'numero_operacion'          => $pagoData['numero_operacion'] ?? null,
                    'usuario_creacion'          => $pagoData['usuario_id'],
                ]);
                break;

            case 'Tarjeta':
                OrdenTesoreriaPagoTarjeta::create([
                    'orden_tesoreria_id' => $orden->id,
                    'tarjeta_origen_id'  => $pagoData['tarjeta_origen_id'],
                    'numero_operacion'   => $pagoData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $pagoData['usuario_id'],
                ]);
                break;

            case 'Cheque':

            if (empty($pagoData['cuenta_origen_id'])) {
                throw new \Exception('La cuenta bancaria es obligatoria para pagos con cheque');
            }

            DB::transaction(function () use ($orden, $pagoData) {

                // 🔹 Bloquear últimos cheques de la cuenta para evitar duplicados
                $ultimoNumero = Cheque::where('cuenta_bancaria_id', $pagoData['cuenta_origen_id'])
                    ->lockForUpdate()
                    ->max('numero');

                $nuevoNumero = ($ultimoNumero ?? 0) + 1;

                // 🔹 Crear cheque
                $cheque = Cheque::create([
                    'cuenta_bancaria_id' => $pagoData['cuenta_origen_id'],
                    'numero'             => $nuevoNumero,
                ]);

                // 🔹 Asociar a la orden
                OrdenTesoreriaPagoCheque::create([
                    'orden_tesoreria_id' => $orden->id,
                    'cheque_id'          => $cheque->id,
                    'numero_cheque'      => $nuevoNumero,
                    'fecha_cheque'       => $pagoData['fecha_cheque'] ?? null,
                    'numero_operacion'   => $pagoData['numero_operacion'] ?? null,
                    'usuario_creacion'   => $pagoData['usuario_id'],
                ]);
            });

            break;

            default:
                throw new \Exception("Método de pago no soportado: {$metodo->codigo}");
        }
    }




    ////ACTUALIZAR ORDEN DE PAGO
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
                'cbu_id' => $ordenData['cbu_id'] ?? $orden->cbu_id,
            ]);
        }



        return response()->json(['message' => 'Órdenes actualizadas correctamente']);
    }

    //// PROCESAR ORDEN DE PAGO
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
                    'tipo_movimiento'     => 'salida',
                    'monto'               => $ordenData['importe'],
                    'tipo'                => $ordenData['tipo'],
                    'tipo_id'             => $ordenData['tipo_id'],
                    'metodo_id'           => $ordenData['metodo_id'] ?? null,
                    'tipo_moneda_id'      => $ordenData['moneda_id'] ?? null,
                    'banco_id'            => $ordenData['banco_origen_id'] ?? null,
                    'cuenta_bancaria_id'  => $ordenData['cuenta_origen_id'] ?? null,
                    'orden_id'       => $orden->id,
                    'usuario_id'          => $usuarioId,
                    'descripcion'         => "Pago de Orden #{$orden->id}",
                    'referencia_bancaria' => $ordenData['cbu_id'] ?? null,
                ]);

                $tipo    = $ordenData['tipo'];      // proveedor | cliente
                $tipoId  = $ordenData['tipo_id'];   // id del proveedor o cliente


                // --------- 4. CUENTAS CONTABLES ----------
                ////////////////////VER PARA AJUSTAR CUENTA CONTABLE
                if ($tipo === 'proveedor') {

                    $sujeto = Proveedor::findOrFail($tipoId);

                } elseif ($tipo === 'cliente') {

                    $sujeto = \App\Models\Padron\Cliente\Cliente::findOrFail($tipoId);

                } else {
                    throw new \Exception("Tipo no válido para orden de pago: {$tipo}");
                }

                ///////////////////////////////////////////////////////////
                $metodo    = MetodoTesoreria::find($ordenData['metodo_id']);

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
