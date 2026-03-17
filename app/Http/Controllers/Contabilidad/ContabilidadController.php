<?php

namespace App\Http\Controllers\Contabilidad;
use App\Http\Controllers\Controller;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\MotivoNotaCredito;
use App\Models\Contabilidad\MotivoNotaDebito;
use App\Models\Contabilidad\MotivoReembolso;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\Contabilidad\RelacionComprobanteMotivoNotaCredito;
use App\Models\Contabilidad\RelacionComprobanteMotivoNotaDebito;
use App\Models\Contabilidad\RelacionComprobanteMotivoReembolso;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\Impuesto;
use App\Models\General\MetodoTesoreria;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContabilidadController extends Controller
{
    ////LISTAR MOVIMIENTOS DE TESORERÍA
    public function movimientosTesoreria()
    {
        $movimientosTesoreria = MovimientoTesoreria::with([
            'banco',
            'cuentaBancaria',
            'metodoPago',
            'tipoMoneda',
            'OrdenTesoreria',
            'proveedor',
        ])->get();

       return Inertia::render('Contabilidad/Conciliar/Index', [
            'movimientosTesoreria' => $movimientosTesoreria,
            'proveedores' => Proveedor::select('id', 'nombre_fantasia', 'razon_social')->orderBy('nombre_fantasia')->get(),
            'metodosPago' => MetodoTesoreria::select('id', 'nombre')->get(),
            'monedas' => TipoMoneda::select('id', 'descripcion')->get(),
            'tiposComprobante' => TipoComprobante::select('id', 'nombre')->get(),
            'bancos' => Banco::select('id', 'banco')->get(),
            'cuentasBancarias' => CuentaBancaria::select('id', 'banco_id', 'numero_cuenta', 'tipo_cuenta')->get(),
            'tarjetas' => Tarjeta::select('id', 'cuenta_bancaria_id', 'numero_tarjeta', 'tipo')->get(),

        ]);
    }

    ////CONCILIAR MOVIMIENTOS DE TESORERÍA
    public function conciliarMovimientos(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        $userId = Auth::id();
        $fecha = now();



        MovimientoTesoreria::query()
            ->whereIn('id', $request->ids)
            ->update([
                'conciliado' => 1,
                'fecha_conciliacion' => $fecha,
                'usuario_conciliado_id' => $userId,
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Movimientos conciliados correctamente',
            'fecha' => $fecha,
            'usuario_id' => $userId
        ]);
    }

    public function planCuentas()
    {
        return Cuenta::all();
    }


    public function libroMayor()
    {

       return Inertia::render('Contabilidad/LibroMayor/Index', [

            'ejercicios' => Ejercicio::all(),
        ]);
    }

    ////LISTAR LIBRO MAYOR
    public function libroMayorListar(Request $request)
    {
        $request->validate([
            'ejercicio_id' => 'required|integer',
            'desde' => 'required|date',
            'hasta' => 'required|date',
        ]);

        $ejercicios = Ejercicio::all();

        $asientos = Asiento::with([
            'partidas',
            'partidas.cuenta',
            'ejercicio',
        ])
        ->where('co_ejercicio_id', $request->ejercicio_id)
        ->whereDate('fecha', '>=', $request->desde)
        ->whereDate('fecha', '<=', $request->hasta)
        ->get();

        return inertia('Contabilidad/LibroMayor/Index', [
            'ejercicios' => $ejercicios,
            'asientos'   => $asientos,
            'ejercicio_id' => $request->ejercicio_id,
            'desde'   => $request->desde,
            'hasta'   => $request->hasta,
        ]);

    }

    public function libroMayorEmpresa()
    {

       return Inertia::render('Contabilidad/LibroMayorEmpresa/Index', [

            'ejercicios' => Ejercicio::all(),
            'empresas' => Proveedor::all(),
        ]);
    }

    ////LISTAR LIBRO MAYOR
    public function libroMayorEmpresaListar(Request $request)
    {
        $request->validate([
            'ejercicio_id' => 'required|integer',
            'desde' => 'required|date',
            'hasta' => 'required|date',
            'tipo_id' => 'required|integer',
        ]);

        $ejercicios = Ejercicio::all();
        $empresas = Proveedor::all();

        $asientos = Asiento::with([
            'partidas',
            'partidas.cuenta',
            'partidas.comprobantes.proveedor',
            'ejercicio',
        ])
        ->where('co_ejercicio_id', $request->ejercicio_id)
        ->whereDate('fecha', '>=', $request->desde)
        ->whereDate('fecha', '<=', $request->hasta)
        ->when($request->tipo_id, function ($q) use ($request) {
            $q->whereHas('partidas.comprobantes', function ($q2) use ($request) {
                $q2->where('tipo_id', $request->tipo_id);
            });
        })
        ->get();

        return inertia('Contabilidad/LibroMayorEmpresa/Index', [
            'ejercicios' => $ejercicios,
            'asientos'   => $asientos,
            'empresas'   => $empresas,
            'ejercicio_id' => $request->ejercicio_id,
            'desde'   => $request->desde,
            'hasta'   => $request->hasta,
            'tipo_id' => $request->tipo_id,

        ]);

    }


    public function libroDiario()
    {
       return Inertia::render('Contabilidad/LibroDiario/Index', [

            'ejercicios' => Ejercicio::all(),
        ]);
    }

    ////LISTAR LIBRO DIARIO
    public function libroDiarioListar(Request $request)
    {
        $request->validate([
            'ejercicio_id' => 'required|integer',
            'desde' => 'required|date',
            'hasta' => 'required|date',
        ]);

        $ejercicios = Ejercicio::all();

        $asientos = Asiento::with([
            'partidas',
            'partidas.cuenta',
            'ejercicio',
        ])
        ->where('co_ejercicio_id', $request->ejercicio_id)
        ->whereDate('fecha', '>=', $request->desde)
        ->whereDate('fecha', '<=', $request->hasta)
        ->get();

        return inertia('Contabilidad/LibroDiario/Index', [
            'ejercicios' => $ejercicios,
            'asientos'   => $asientos,
            'ejercicio_id' => $request->ejercicio_id,
            'desde'   => $request->desde,
            'hasta'   => $request->hasta,
        ]);

    }

    ////////BALANCE GENERAL
    public function balanceGeneral()
    {
       return Inertia::render('Contabilidad/BalanceGeneral/Index', [

            'ejercicios' => Ejercicio::all(),
        ]);
    }

    //// LISTAR BALANCE GENERAL
    public function balanceGeneralListar(Request $request)
    {
        $request->validate([
            'ejercicio_id' => 'required|integer',
            'desde' => 'required|date',
            'hasta' => 'required|date',
        ]);

        $ejercicios = Ejercicio::all();

        $asientos = Asiento::with([
            'partidas',
            'partidas.cuenta',
        ])
        ->where('co_ejercicio_id', $request->ejercicio_id)
        ->whereDate('fecha', '>=', $request->desde)
        ->whereDate('fecha', '<=', $request->hasta)
        ->get();

        // ================================
        // ARMAR BALANCE POR CUENTA
        // ================================
        $cuentas = [];

        foreach ($asientos as $asiento) {
            foreach ($asiento->partidas as $p) {

                $id = $p->cuenta->id;

                if (!isset($cuentas[$id])) {
                    $cuentas[$id] = [
                        'cuenta_id' => $id,
                        'codigo'    => $p->cuenta->codigo,
                        'descripcion' => $p->cuenta->descripcion,
                        'grupo'     => $p->cuenta->grupo,    // EJ: ACTIVO, PASIVO, PN
                        'subgrupo'  => $p->cuenta->subgrupo, // EJ: corriente, no corriente
                        'saldo'     => 0,
                    ];
                }

                $cuentas[$id]['saldo'] += floatval($p->debe) - floatval($p->haber);
            }
        }

        // Convertir a array ordenado
        $balance = array_values($cuentas);

        return inertia('Contabilidad/BalanceGeneral/Index', [
            'ejercicios'   => $ejercicios,
            'balance'      => $balance,
            'ejercicio_id' => $request->ejercicio_id,
            'desde'        => $request->desde,
            'hasta'        => $request->hasta,
        ]);
    }

    ////////NOTAS DE CREDITO
    public function motivosNotaCredito()
    {
        return MotivoNotaCredito::all();
    }


    ///////EMITIR NOTA DE CREDITO
    public function emitirNotaCredito(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'factura_id' => 'required|exists:comprobantes,id',
            'fecha' => 'required|date',
            'fecha_vencimiento' => 'required|date',
            'tipo' => 'required|in:total,parcial',
            'condicion_venta_id' => 'required|exists:condiciones_venta,id',
            'motivo_nota_credito_id' => 'required|exists:motivos_nota_credito,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'nullable|exists:productos,id',
            'detalles.*.cantidad' => 'required|numeric|min:0',
            'detalles.*.descripcion' => 'required|string',
            'detalles.*.importe' => 'required|numeric|min:0',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.porcentaje_descuento' => 'required|numeric|min:0',
            'detalles.*.impuestos_seleccionados' => 'nullable|array',
            'detalles.*.impuestos_seleccionados.*' => 'nullable|exists:impuestos,id',
            'detalles.*.co_cuenta_id' => 'required|exists:co_cuentas,id',
            'detalles.*.modelo' => 'nullable|string',
            'detalles.*.unidad_medida_id' => 'nullable|exists:unidades_medida,id',
            'total_factura' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {

            $factura = Comprobante::with([
                'detalles',
                'comprobantesAplicados',
                'ordenesTesoreria',
                'tipoComprobante'
                ])
                ->findOrFail($request['factura_id']);

            // 🔒 Validación AFIP: tipo de NC = tipo de factura
            if (!$factura->tipoComprobante->esFactura()) {
                throw ValidationException::withMessages([
                    'factura_id' => 'El comprobante seleccionado no es una factura válida.'
                ]);
            }

            // Calcular saldo
            $totalFactura = $request['total_factura'];
            /*$pagos = $factura->ordenesTesoreria->sum('importe');
            $notasCredito = $factura->comprobantesAplicados->sum('importe');
            $saldo = $totalFactura - $pagos - $notasCredito;*/

            $totalNC = collect($request['detalles'])->sum('importe');

            if ($request['tipo'] === 'parcial' && $totalNC >= $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'El importe de la nota de crédito supera el saldo pendiente.'
                ]);
            }

            if ($request['tipo'] === 'total' && $totalNC != $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'La nota de crédito total debe cancelar exactamente el saldo.'
                ]);
            }

            $tipoNcId = match ($factura->tipo_comprobante_id) {
                1 => 4, // Factura A → NC A
                2 => 5, // Factura B → NC B
                default => throw ValidationException::withMessages([
                    'factura_id' => 'Tipo de factura no soportado para nota de crédito.'
                ])
            };

            // 🧾 Crear comprobante NC
            $notaCredito = Comprobante::create([
                'tipo' => 'Cliente',
                'tipo_id' => $request['cliente_id'],
                'fecha_factura' => $request['fecha'],
                'fecha_vencimiento' => $request['fecha_vencimiento'],
                'condicion_venta_id' => $request['condicion_venta_id'],
                'punto_venta' => $factura->punto_venta,
                'numero_factura' => Comprobante::siguienteNumero(
                    $factura->punto_venta,
                    $tipoNcId,
                    'Cliente'
                ),
                'tipo_comprobante_id' => $tipoNcId,
                'moneda_id' => $factura->moneda_id,
                'estado' => 'Pendiente',
                'descripcion' => 'Nota de Crédito sobre factura ' .
                    $factura->punto_venta . '-' . $factura->numero_factura,
                'usuario_creacion' => auth()->id(),
                'tipo' => 'Cliente',
            ]);

            // 📦 Detalle
            foreach ($request['detalles'] as $detalle) {

                // Crear detalle del comprobante
                $detalleComprobante = $notaCredito->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'descripcion' => $detalle['descripcion'] ,
                    'modelo' => $detalle['modelo'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'porcentaje_descuento' => $detalle['porcentaje_descuento'],
                    'co_cuenta_id' => $detalle['co_cuenta_id'],
                    'importe' => $detalle['importe'],
                    'usuario_creacion' => auth()->id(),
                ]);

                // Acumular gasto por cuenta
                if (!isset($gastosAgrupados[$detalle['co_cuenta_id']])) {
                    $gastosAgrupados[$detalle['co_cuenta_id']] = 0;
                }

                $gastosAgrupados[$detalle['co_cuenta_id']] += $detalle['importe'];
                $totalFactura += $detalle['importe'];

                // ---------------- IMPUESTOS DEL DETALLE ----------------
                if (!empty($detalle['impuestos_seleccionados'])) {

                    foreach ($detalle['impuestos_seleccionados'] as $impuestoId) {

                        $imp = Impuesto::find($impuestoId);
                        if (!$imp) continue;

                        if (empty($imp->co_cuenta_id)) {
                            throw new \Exception(
                                "El impuesto '{$imp->descripcion}' no tiene una cuenta contable asignada."
                            );
                        }

                        $importeDetalle = (float) $detalle['importe'];
                        $porcentaje = (float) $imp->porcentaje;

                        $importeImpuesto = ($importeDetalle * $porcentaje) / 100;

                        DB::table('comprobantes_detalles_impuestos')->insert([
                            'detalle_id' => $detalleComprobante->id,
                            'impuesto_id' => $imp->id
                        ]);

                        if (!isset($impuestosAgrupados[$imp->co_cuenta_id])) {
                            $impuestosAgrupados[$imp->co_cuenta_id] = [
                                'nombre' => $imp->descripcion,
                                'importe' => 0
                            ];
                        }

                        $impuestosAgrupados[$imp->co_cuenta_id]['importe'] += $importeImpuesto;
                        $totalFactura += $importeImpuesto;
                    }
                }


            }

            // 🔗 Relación NC ↔ Factura
            $factura->comprobantesAplicados()->attach($notaCredito->id, [
                'importe_aplicado' => $totalNC
            ]);

            // --------------------------------------------------------
            // 3️⃣ GENERAR ASIENTO CONTABLE
            // --------------------------------------------------------
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();

            $asiento = Asiento::create([
                'numero' => Asiento::max('numero') + 1,
                'co_ejercicio_id' => $ejercicio->id,
                'fecha' => $request->fecha,
                'concepto' => "Nota de crédito cliente N° {$notaCredito->id}",
                'estado' => 'Pendiente',
                'importe' => $totalFactura,
                'model_id_created' => $request->usuario_creacion,
                'created_at' => now(),
            ]);

            // ---------------- PARTIDAS DE GASTOS ----------------
            foreach ($gastosAgrupados as $cuentaId => $importe) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Gasto nota de crédito cliente",
                    'debe' => $importe,
                    'haber' => 0,
                ]);
            }

            // ---------------- PARTIDAS DE IMPUESTOS ----------------
            foreach ($impuestosAgrupados as $cuentaId => $data) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Impuesto: {$data['nombre']}",
                    'debe' => $data['importe'],
                    'haber' => 0,
                ]);
            }


            // ---------------- PARTIDA DE CLIENTE (HABER) ----------------
            $cliente = Cliente::find($request->cliente_id);
            if (!$cliente) {
                throw new \Exception("Cliente no encontrado con ID {$request->cliente_id}");
            }

            Partida::create([
                'co_asiento_id' => $asiento->id,
                'co_cuenta_id' => '222',
                'concepto' => "Cliente {$cliente->nombre}",
                'debe' => 0,
                'haber' => $totalFactura,
            ]);

            // --------------------------------------------------------

            // 🧠 Motivo
            RelacionComprobanteMotivoNotaCredito::create([
                'comprobante_id' => $notaCredito->id,
                'motivo_nota_credito_id' => $request['motivo_nota_credito_id'],
            ]);

            return response()->json($notaCredito);
        });
    }


    ////////NOTAS DE DÉBITO
    public function motivosNotaDebito()
    {
        return MotivoNotaDebito::all();
    }


    ///////EMITIR NOTA DE DÉBITO
    public function emitirNotaDebito(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'factura_id' => 'required|exists:comprobantes,id',
            'fecha' => 'required|date',
            'fecha_vencimiento' => 'required|date',
            'tipo' => 'required|in:total,parcial',
            'condicion_venta_id' => 'required|exists:condiciones_venta,id',
            'motivo_nota_debito_id' => 'required|exists:motivos_nota_debito,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'nullable|exists:productos,id',
            'detalles.*.cantidad' => 'required|numeric|min:0',
            'detalles.*.descripcion' => 'required|string',
            'detalles.*.importe' => 'required|numeric|min:0',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.porcentaje_descuento' => 'required|numeric|min:0',
            'detalles.*.impuestos_seleccionados' => 'nullable|array',
            'detalles.*.impuestos_seleccionados.*' => 'nullable|exists:impuestos,id',
            'detalles.*.co_cuenta_id' => 'required|exists:co_cuentas,id',
            'detalles.*.modelo' => 'nullable|string',
            'detalles.*.unidad_medida_id' => 'nullable|exists:unidades_medida,id',
            'total_factura' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {

            $factura = Comprobante::with([
                'detalles',
                'comprobantesAplicados',
                'ordenesTesoreria',
                'tipoComprobante'
                ])
                ->findOrFail($request['factura_id']);

            // 🔒 Validación AFIP: tipo de NC = tipo de factura
            if (!$factura->tipoComprobante->esFactura()) {
                throw ValidationException::withMessages([
                    'factura_id' => 'El comprobante seleccionado no es una factura válida.'
                ]);
            }

            // Calcular saldo
            $totalFactura = $request['total_factura'];
            /*$pagos = $factura->ordenesTesoreria->sum('importe');
            $notasDebito = $factura->comprobantesAplicados->sum('importe');
            $saldo = $totalFactura - $pagos - $notasDebito;*/

            $totalND = collect($request['detalles'])->sum('importe');

            if ($request['tipo'] === 'parcial' && $totalND >= $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'El importe de la nota de débito supera el saldo pendiente.'
                ]);
            }

            if ($request['tipo'] === 'total' && $totalND != $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'La nota de débito total debe cancelar exactamente el saldo.'
                ]);
            }

            $tipoNdId = match ($factura->tipo_comprobante_id) {
                1 => 3, // Factura A → ND A
                2 => 4, // Factura B → ND B
                default => throw ValidationException::withMessages([
                    'factura_id' => 'Tipo de factura no soportado para nota de débito.'
                ])
            };

            // 🧾 Crear comprobante ND
            $notaDebito = Comprobante::create([
                'tipo' => 'Cliente',
                'tipo_id' => $request['cliente_id'],
                'fecha_factura' => $request['fecha'],
                'fecha_vencimiento' => $request['fecha_vencimiento'],
                'condicion_venta_id' => $request['condicion_venta_id'],
                'punto_venta' => $factura->punto_venta,
                'numero_factura' => Comprobante::siguienteNumero(
                    $factura->punto_venta,
                    $tipoNdId,
                    'Cliente'
                ),
                'tipo_comprobante_id' => $tipoNdId,
                'moneda_id' => $factura->moneda_id,
                'estado' => 'Pendiente',
                'descripcion' => 'Nota de Débito sobre factura ' .
                    $factura->punto_venta . '-' . $factura->numero_factura,
                'usuario_creacion' => auth()->id(),
                'tipo' => 'Cliente',
            ]);

            // 📦 Detalle
            foreach ($request['detalles'] as $detalle) {

                // Crear detalle del comprobante
                $detalleComprobante = $notaDebito->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'descripcion' => $detalle['descripcion'] ,
                    'modelo' => $detalle['modelo'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'porcentaje_descuento' => $detalle['porcentaje_descuento'],
                    'co_cuenta_id' => $detalle['co_cuenta_id'],
                    'importe' => $detalle['importe'],
                    'usuario_creacion' => auth()->id(),
                ]);

                // Acumular gasto por cuenta
                if (!isset($gastosAgrupados[$detalle['co_cuenta_id']])) {
                    $gastosAgrupados[$detalle['co_cuenta_id']] = 0;
                }

                $gastosAgrupados[$detalle['co_cuenta_id']] += $detalle['importe'];
                $totalFactura += $detalle['importe'];

                // ---------------- IMPUESTOS DEL DETALLE ----------------
                if (!empty($detalle['impuestos_seleccionados'])) {

                    foreach ($detalle['impuestos_seleccionados'] as $impuestoId) {

                        $imp = Impuesto::find($impuestoId);
                        if (!$imp) continue;

                        if (empty($imp->co_cuenta_id)) {
                            throw new \Exception(
                                "El impuesto '{$imp->descripcion}' no tiene una cuenta contable asignada."
                            );
                        }

                        $importeDetalle = (float) $detalle['importe'];
                        $porcentaje = (float) $imp->porcentaje;

                        $importeImpuesto = ($importeDetalle * $porcentaje) / 100;

                        DB::table('comprobantes_detalles_impuestos')->insert([
                            'detalle_id' => $detalleComprobante->id,
                            'impuesto_id' => $imp->id
                        ]);

                        if (!isset($impuestosAgrupados[$imp->co_cuenta_id])) {
                            $impuestosAgrupados[$imp->co_cuenta_id] = [
                                'nombre' => $imp->descripcion,
                                'importe' => 0
                            ];
                        }

                        $impuestosAgrupados[$imp->co_cuenta_id]['importe'] += $importeImpuesto;
                        $totalFactura += $importeImpuesto;
                    }
                }


            }

            // 🔗 Relación ND ↔ Factura
            $factura->comprobantesAplicados()->attach($notaDebito->id, [
                'importe_aplicado' => $totalFactura
            ]);

            // --------------------------------------------------------
            // 3️⃣ GENERAR ASIENTO CONTABLE
            // --------------------------------------------------------
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();

            $asiento = Asiento::create([
                'numero' => Asiento::max('numero') + 1,
                'co_ejercicio_id' => $ejercicio->id,
                'fecha' => $request->fecha,
                'concepto' => "Nota de débito cliente N° {$notaDebito->id}",
                'estado' => 'Pendiente',
                'importe' => $totalFactura,
                'model_id_created' => $request->usuario_creacion,
                'created_at' => now(),
            ]);

            // ---------------- PARTIDAS DE GASTOS ----------------
            foreach ($gastosAgrupados as $cuentaId => $importe) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Gasto nota de débito cliente",
                    'debe' => $importe,
                    'haber' => 0,
                ]);
            }

            // ---------------- PARTIDAS DE IMPUESTOS ----------------
            foreach ($impuestosAgrupados as $cuentaId => $data) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Impuesto: {$data['nombre']}",
                    'debe' => $data['importe'],
                    'haber' => 0,
                ]);
            }


            // ---------------- PARTIDA DE CLIENTE (HABER) ----------------
            $cliente = Cliente::find($request->cliente_id);
            if (!$cliente) {
                throw new \Exception("Cliente no encontrado con ID {$request->cliente_id}");
            }

            Partida::create([
                'co_asiento_id' => $asiento->id,
                'co_cuenta_id' => '222',
                'concepto' => "Cliente {$cliente->nombre}",
                'debe' => 0,
                'haber' => $totalFactura,
            ]);

            // --------------------------------------------------------

            // 🧠 Motivo
            RelacionComprobanteMotivoNotaDebito::create([
                'comprobante_id' => $notaDebito->id,
                'motivo_nota_debito_id' => $request['motivo_nota_debito_id'],
            ]);

            return response()->json($notaDebito);
        });
    }


    ////////REEMBOLSOS
    public function motivosReembolso()
    {
        return MotivoReembolso::all();
    }


    ///////EMITIR REEMBOLSO
    public function emitirReembolso(Request $request)
    {
        $request->validate([
            'proveedor_id' => 'required|exists:proveedores,id',
            'factura_id' => 'required|exists:comprobantes,id',
            'fecha' => 'required|date',
            'fecha_vencimiento' => 'required|date',
            'tipo' => 'required|in:total,parcial',
            'condicion_venta_id' => 'required|exists:condiciones_venta,id',
            'motivo_reembolso_id' => 'required|exists:motivos_reembolso,id',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'nullable|exists:productos,id',
            'detalles.*.cantidad' => 'required|numeric|min:0',
            'detalles.*.descripcion' => 'required|string',
            'detalles.*.importe' => 'required|numeric|min:0',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.porcentaje_descuento' => 'required|numeric|min:0',
            'detalles.*.impuestos_seleccionados' => 'nullable|array',
            'detalles.*.impuestos_seleccionados.*' => 'nullable|exists:impuestos,id',
            'detalles.*.co_cuenta_id' => 'required|exists:co_cuentas,id',
            'detalles.*.modelo' => 'nullable|string',
            'detalles.*.unidad_medida_id' => 'nullable|exists:unidades_medida,id',
            'total_factura' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {

            $factura = Comprobante::with([
                'detalles',
                'comprobantesAplicados',
                'ordenesTesoreria',
                'tipoComprobante'
                ])
                ->findOrFail($request['factura_id']);

            // 🔒 Validación AFIP: tipo de NC = tipo de factura
            if (!$factura->tipoComprobante->esFactura()) {
                throw ValidationException::withMessages([
                    'factura_id' => 'El comprobante seleccionado no es una factura válida.'
                ]);
            }

            // Calcular saldo
            $totalFactura = $request['total_factura'];
            /*$pagos = $factura->ordenesTesoreria->sum('importe');
            $notasCredito = $factura->comprobantesAplicados->sum('importe');
            $saldo = $totalFactura - $pagos - $notasCredito;*/

            $totalNC = collect($request['detalles'])->sum('importe');

            if ($request['tipo'] === 'parcial' && $totalNC >= $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'El importe de la nota de crédito supera el saldo pendiente.'
                ]);
            }

            if ($request['tipo'] === 'total' && $totalNC != $totalFactura) {
                throw ValidationException::withMessages([
                    'detalles' => 'El reembolso total debe cancelar exactamente el saldo.'
                ]);
            }

            $tipoNcId = match ($factura->tipo_comprobante_id) {
                1 => 4, // Factura A → NC A
                2 => 5, // Factura B → NC B
                default => throw ValidationException::withMessages([
                    'factura_id' => 'Tipo de factura no soportado para nota de crédito.'
                ])
            };

            // 🧾 Crear comprobante Reembolso
            $reembolso = Comprobante::create([
                'tipo' => 'Proveedor',
                'tipo_id' => $request['proveedor_id'],
                'fecha_factura' => $request['fecha'],
                'fecha_vencimiento' => $request['fecha_vencimiento'],
                'condicion_venta_id' => $request['condicion_venta_id'],
                'punto_venta' => $factura->punto_venta,
                'numero_factura' => Comprobante::siguienteNumero(
                    $factura->punto_venta,
                    $tipoNcId,
                    'Cliente'
                ),
                'tipo_comprobante_id' => $tipoNcId,
                'moneda_id' => $factura->moneda_id,
                'estado' => 'Pendiente',
                'descripcion' => 'Reembolso sobre factura ' .
                    $factura->punto_venta . '-' . $factura->numero_factura,
                'usuario_creacion' => auth()->id(),
                'tipo' => 'Proveedor',
            ]);

            // 📦 Detalle
            foreach ($request['detalles'] as $detalle) {

                // Crear detalle del comprobante
                $detalleComprobante = $reembolso->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'descripcion' => $detalle['descripcion'] ,
                    'modelo' => $detalle['modelo'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'porcentaje_descuento' => $detalle['porcentaje_descuento'],
                    'co_cuenta_id' => $detalle['co_cuenta_id'],
                    'importe' => $detalle['importe'],
                    'usuario_creacion' => auth()->id(),
                ]);

                // Acumular gasto por cuenta
                if (!isset($gastosAgrupados[$detalle['co_cuenta_id']])) {
                    $gastosAgrupados[$detalle['co_cuenta_id']] = 0;
                }

                $gastosAgrupados[$detalle['co_cuenta_id']] += $detalle['importe'];
                $totalFactura += $detalle['importe'];

                // ---------------- IMPUESTOS DEL DETALLE ----------------
                if (!empty($detalle['impuestos_seleccionados'])) {

                    foreach ($detalle['impuestos_seleccionados'] as $impuestoId) {

                        $imp = Impuesto::find($impuestoId);
                        if (!$imp) continue;

                        if (empty($imp->co_cuenta_id)) {
                            throw new \Exception(
                                "El impuesto '{$imp->descripcion}' no tiene una cuenta contable asignada."
                            );
                        }

                        $importeDetalle = (float) $detalle['importe'];
                        $porcentaje = (float) $imp->porcentaje;

                        $importeImpuesto = ($importeDetalle * $porcentaje) / 100;

                        DB::table('comprobantes_detalles_impuestos')->insert([
                            'detalle_id' => $detalleComprobante->id,
                            'impuesto_id' => $imp->id
                        ]);

                        if (!isset($impuestosAgrupados[$imp->co_cuenta_id])) {
                            $impuestosAgrupados[$imp->co_cuenta_id] = [
                                'nombre' => $imp->descripcion,
                                'importe' => 0
                            ];
                        }

                        $impuestosAgrupados[$imp->co_cuenta_id]['importe'] += $importeImpuesto;
                        $totalFactura += $importeImpuesto;
                    }
                }


            }

            // 🔗 Relación Reembolso ↔ Factura
            $factura->comprobantesAplicados()->attach($reembolso->id, [
                'importe_aplicado' => $totalFactura
            ]);

            // --------------------------------------------------------
            // 3️⃣ GENERAR ASIENTO CONTABLE
            // --------------------------------------------------------
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();

            $asiento = Asiento::create([
                'numero' => Asiento::max('numero') + 1,
                'co_ejercicio_id' => $ejercicio->id,
                'fecha' => $request->fecha,
                'concepto' => "Reembolso proveedor N° {$reembolso->id}",
                'estado' => 'Pendiente',
                'importe' => $totalFactura,
                'model_id_created' => $request->usuario_creacion,
                'created_at' => now(),
            ]);

            // ---------------- PARTIDAS DE GASTOS ----------------
            foreach ($gastosAgrupados as $cuentaId => $importe) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Gasto reembolso proveedor",
                    'debe' => $importe,
                    'haber' => 0,
                ]);
            }

            // ---------------- PARTIDAS DE IMPUESTOS ----------------
            foreach ($impuestosAgrupados as $cuentaId => $data) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Impuesto: {$data['nombre']}",
                    'debe' => $data['importe'],
                    'haber' => 0,
                ]);
            }


            // ---------------- PARTIDA DE PROVEEDOR (HABER) ----------------
            $proveedor = Proveedor::find($request->proveedor_id);
            if (!$proveedor) {
                throw new \Exception("Proveedor no encontrado con ID {$request->proveedor_id}");
            }

            Partida::create([
                'co_asiento_id' => $asiento->id,
                'co_cuenta_id' => '222',
                'concepto' => "Proveedor {$proveedor->razon_social}",
                'debe' => 0,
                'haber' => $totalFactura,
            ]);

            // --------------------------------------------------------

            // 🧠 Motivo
            RelacionComprobanteMotivoReembolso::create([
                'comprobante_id' => $reembolso->id,
                'motivo_reembolso_id' => $request['motivo_reembolso_id'],
            ]);

            return response()->json($reembolso);
        });
    }

}
