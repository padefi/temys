<?php

namespace App\Http\Controllers\Contabilidad\Clientes;
use App\Http\Controllers\Controller;
use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\Impuesto;
use App\Models\General\MetodoTesoreria;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Ventas\OrdenCobro;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientesController extends Controller
{
    ////LISTAR CLIENTES CON SALDO
   public function clientesConSaldo()
    {
        $clientes = Cliente::with([
            'padron',
            'comprobantes.detalles',
            'comprobantes.tipoComprobante',
            'comprobantes.ordenesVenta',
            'comprobantes.comprobantesAplicados',
        ])->get();

        $clientes = $clientes->map(function ($p) {
            $totalDebe = 0;
            $totalHaber = 0;
            $cobrosConfirmados = 0;

            foreach ($p->comprobantes as $comp) {

                // Signo según tipo de comprobante
                $signo = $comp->tipoComprobante->signo ?? 1; // 'debe' = 1 / 'haber' = -1
                $afectaSaldo = $comp->tipoComprobante->afecta_saldo ?? true;

                // ❗ Si es Anticipo → NO afecta el saldo
                if ($comp->tipoComprobante->categoria === 'anticipo') {
                    $afectaSaldo = false;
                }

                if ($afectaSaldo) {

                    // Calcular importe del comprobante (sumatoria de detalles)
                    $importeComprobante = $comp->detalles->sum(function ($d) {
                        $cantidad = (float) $d->cantidad;
                        $precioUnitario = (float) $d->precio_unitario;
                        $descuento = (float) ($d->porcentaje_descuento ?? 0);
                        $importe = $cantidad * $precioUnitario;

                        return $importe - ($importe * $descuento / 100);
                    });

                    // Aplica signo debe/haber
                    if ($signo > 0) {
                        $totalDebe += $importeComprobante;
                    } else {
                        $totalHaber += $importeComprobante;
                    }
                }

                // Ordenes de venta (siempre cuentan si están confirmadas)
                foreach ($comp->ordenesVenta as $op) {
                    if ($op->estado === 'Confirmado') {
                        $cobrosConfirmados += (float) ($op->pivot->importe_aplicado ?? 0);
                    }
                }

                // Comprobantes Aplicados (siempre cuentan si están confirmadas)
                foreach ($comp->comprobantesAplicados as $compAplicado) {

                        $cobrosConfirmados += (float) ($compAplicado->pivot->importe_aplicado ?? 0);

                }
            }

            // Saldo final
            $p->saldo = ($totalDebe - $totalHaber) - $cobrosConfirmados;

            return $p;
        });

        return response()->json($clientes);
    }


    ////LISTAR FACTURAS PENDIENTES DE PAGO DE UN CLIENTE
    public function facturasPendientes($clienteId)
    {
        $comprobantes = Comprobante::with([
            'tipoComprobante',
            'detalles',
            'tipoMoneda',
            'comprobantesAplicados' => function ($q) {
                $q->withPivot(['importe_aplicado']);
                },
            'ordenesTesoreria' => function ($q) {
                $q->withPivot(['importe_aplicado']);
                //->where('estado',  ['Pendiente', 'Confirmado']);
                //si quiero solo las pendientes
                //->where('estado', 'pendiente');
                }
            ])
            ->where('tipo_id', $clienteId)
            ->where('estado', '!=', 'Anulado')
            ->get()
            ->filter(function ($comp) {
                $totalFactura = (float) $comp->detalles->sum('importe');
                $totalCobrado = (float) $comp->ordenesTesoreria->sum(fn($op) => $op->pivot->importe_aplicado ?? 0);
                $totalComprobantesAplicados = (float) $comp->comprobantesAplicados->sum(fn($compAplicado) => $compAplicado->pivot->importe_aplicado ?? 0);
                return $totalFactura > $totalCobrado + $totalComprobantesAplicados;
            })
            ->values();

        return response()->json($comprobantes);
    }

    ////LISTAR CUENTA CORRIENTE DE UN CLIENTE
    public function cuentaCorriente($clienteId)
    {
        $comprobantes = Comprobante::with([
            'comprobantesAplicados',
            'tipoComprobante',
            'detalles',
            'ordenesTesoreria' => function ($q) {
            $q->with([
                'metodoCobro',
            ])->withPivot(['importe_aplicado', 'fecha_aplicacion']);
            },
            ])
            ->where('tipo_id', $clienteId)
            ->where('estado', '!=', 'Anulado')
            ->orderBy('fecha_factura', 'asc')
            ->get();

        $movimientos = collect();

        foreach ($comprobantes as $comp) {
            $tipo = $comp->tipoComprobante;
            $estadoComp = ucfirst(strtolower($comp->estado ?? ''));
            $total = (float) $comp->detalles->sum('importe');

            // === COMPROBANTES ===
            $signo = strtolower($tipo->signo ?? 'debe');
            $debe = $signo === 'debe' ? $total : 0.0;
            $haber = $signo === 'haber' ? $total : 0.0;
            $afectaSaldo = (bool) $tipo->afecta_saldo;

            $movimientos->push([
                'grupo_id' => $comp->id,
                'fecha' => $comp->fecha_factura,
                'tipo' => $tipo->nombre ?? '-',
                'numero' => ($comp->punto_venta ? '('.$comp->id.') ' . str_pad($comp->punto_venta, 4, '0', STR_PAD_LEFT) . '-' : '') . $comp->numero_factura,
                'descripcion' => $comp->descripcion,
                'debe' => (float) $debe,
                'haber' => (float) $haber,
                'estado' => $estadoComp,
                'afecta_saldo' => $afectaSaldo,
            ]);

            // === ÓRDENES DE TESORERIA (debajo del comprobante)
            foreach ($comp->ordenesTesoreria as $cobro) {
                $estadoCobro = strtolower($cobro->estado ?? '');
                $importeAplicado = (float) ($cobro->pivot->importe_aplicado ?? 0);

                $importeCobro = (float) $cobro->importe;
                $tipoCobro = $cobro->metodoCobro->descripcion ?? '';

                // 🔹 Si la venta tiene importe aplicado, agregamos un registro de “parcial”
                if ($importeAplicado > 0) {
                    $movimientos->push([
                        'grupo_id' => $comp->id,
                        'fecha' => $cobro->pivot->fecha_aplicacion ?? $cobro->fecha_cobro,
                        'tipo' => 'Orden de Cobro ' . $tipoCobro,
                        'numero' => '('.$cobro->id.')' . ' C-' . str_pad($cobro->id, 4, '0', STR_PAD_LEFT),
                        'descripcion' => 'Importe aplicado a ' . ($tipo->nombre ?? '') . ' ' . $comp->numero_factura,
                        'debe' => 0.0,
                        'haber' => (float) $importeAplicado,
                        'estado' => ucfirst($estadoCobro),
                        'afecta_saldo' => true, // 🔸 El parcial SÍ afecta saldo
                    ]);
                }




                // 🔹 La orden de venta completa
               /* $afectaSaldo = $estadoCobro === 'confirmado'; // solo confirmadas afectan saldo
                $movimientos->push([
                    'grupo_id' => $comp->id,
                    'fecha' => $cobro->fecha_cobro,
                    'tipo' => 'Orden de Cobro ' . $tipoCobro,
                    'numero' => '('.$cobro->id.')' . ' C-' . str_pad($cobro->id, 4, '0', STR_PAD_LEFT),
                    'descripcion' => 'Cobro aplicado a ' . ($tipo->nombre ?? '') . ' ' . $comp->numero_factura,
                    'debe' => 0.0,
                    'haber' => (float) $importeCobro,
                    'estado' => ucfirst($estadoCobro),
                    'afecta_saldo' => $afectaSaldo,
                ]);*/
            }

            // === APLICACIONES DE COMPROBANTES (ANTICIPOS) ===
                foreach ($comp->comprobantesAplicados as $aplicado) {

                    $importeAplicado = (float) ($aplicado->pivot->importe_aplicado ?? 0);


                    if ($importeAplicado <= 0) {
                        continue;
                    }

                    $movimientos->push([
                        'grupo_id' => $comp->id, // DESTINO
                        'fecha' => $aplicado->pivot->fecha_aplicacion ?? $aplicado->fecha_factura,
                        'tipo' => 'Aplicación de ' . ($aplicado->tipoComprobante->nombre ?? 'Anticipo'),
                        'numero' =>
                            '(' . $aplicado->id . ') ' .
                            str_pad($aplicado->punto_venta, 4, '0', STR_PAD_LEFT) .
                            '-' . $aplicado->numero_factura,
                        'descripcion' =>
                            'Aplicado a ' . ($tipo->nombre ?? '') . ' (' . $comp->id  . ') ' . $comp->punto_venta . ' - ' . $comp->numero_factura,
                        'debe' => 0.0,
                        'haber' => $importeAplicado,
                        'estado' => 'Aplicado',
                        'afecta_saldo' => true, // 🔥 CLAVE
                    ]);
                }
        }

        // 🔹 Agrupamos por comprobante y mantenemos orden
        $movimientos = $movimientos
            ->groupBy('grupo_id')
            ->sortKeys()
            ->flatMap(fn($grupo) => $grupo)
            ->values();

        // 🔹 Calculamos saldo
        $saldo = 0.0;
        $movimientos = $movimientos->map(function ($m) use (&$saldo) {
            if ($m['afecta_saldo']) {
                $saldo += $m['debe'] - $m['haber'];
            }
            $m['saldo'] = $saldo;
            return $m;
        });

        return response()->json($movimientos->values());
    }


    ////LISTAR ÓRDENES DE COBRO DE UN CLIENTE
    public function cobrosClientes()
    {
        $ordenesTesoreria = OrdenTesoreria::with([
            'plan',
            'moneda',
            'metodoCobro',
            'bancoOrigen',
            'cuentaOrigen',
            'tarjetaOrigen',
            'tarjetaOrigen.cuentaBancaria',
            'tarjetaOrigen.cuentaBancaria.banco',
            'comprobantes',
            'comprobantes.tipoComprobante',
            'comprobantes.tipoMoneda',
            'comprobantes.cliente',
        ])->get();
        return Inertia::render('Contabilidad/Cobros/Index', [
            'ordenesTesoreria' => $ordenesTesoreria,
            'clientes' => Cliente::select('id', 'nombre', 'apellido')->orderBy('nombre')->get(),
            'metodosCobro' => MetodoTesoreria::select('id', 'nombre')->get(),
            'monedas' => TipoMoneda::select('id', 'descripcion')->get(),
            'tiposComprobante' => TipoComprobante::select('id', 'nombre')->get(),
            'bancos' => Banco::select('id', 'banco')->get(),
            'cuentasBancarias' => CuentaBancaria::select('id', 'banco_id', 'numero_cuenta', 'tipo_cuenta')->get(),
            'tarjetas' => Tarjeta::select('id', 'cuenta_bancaria_id', 'numero_tarjeta', 'tipo')->get(),

        ]);
    }

    //// LISTAR CBU DE CLIENTE
    public function cbus($clienteId)
    {
        $cliente = Cliente::findOrFail($clienteId);
        return response()->json(
            $cliente->cbu()
            ->select('id', 'tipo_clave', 'clave', 'alias', 'predeterminado')
            ->orderByDesc('predeterminado')
            ->get()
        );
    }

    //// LISTAR NOTAS DE CREDITO
    public function notasDeCredito()
    {

        $clientes = Cliente::with([
            'padron',
            'comprobantes.detalles',
            'comprobantes.tipoComprobante',
            'comprobantes.ordenesVenta',
            'comprobantes.comprobantesAplicados',
            'comprobantes.detalles.impuestos',
            'comprobantes.archivos'
        ])->get();

        return Inertia::render('Contabilidad/Clientes/NotasCredito/Index', [
            'clientes' => $clientes,
            'impuestos' => Impuesto::all(),

        ]);
    }

    //// LISTAR NOTAS DE DÉBITO
    public function notasDeDebito()
    {

        $clientes = Cliente::with([
            'padron',
            'comprobantes.detalles',
            'comprobantes.tipoComprobante',
            'comprobantes.ordenesVenta',
            'comprobantes.comprobantesAplicados',
            'comprobantes.detalles.impuestos',
            'comprobantes.archivos'
        ])->get();

        return Inertia::render('Contabilidad/Clientes/NotasDebito/Index', [
            'clientes' => $clientes,
            'impuestos' => Impuesto::all(),

        ]);
    }

    ////LISTAR TODAS LAS FACTURAS DE UN CLIENTE
    public function facturasTotales($clienteId)
    {
        $comprobantes = Comprobante::with([
            'tipoComprobante',
            'detalles',
            'detalles.unidadMedida',
            'tipoMoneda',
            'comprobantesAplicados' => function ($q) {
                $q->withPivot(['importe_aplicado']);
                },
            'ordenesTesoreria' => function ($q) {
                $q->withPivot(['importe_aplicado']);
                //->where('estado',  ['Pendiente', 'Confirmado']);
                //si quiero solo las pendientes
                //->where('estado', 'pendiente');
                }
            ])
            ->where('tipo_id', $clienteId)
            ->where('estado', '!=', 'Anulado')
            ->get()
            ->values();

        return response()->json($comprobantes);
    }







}
