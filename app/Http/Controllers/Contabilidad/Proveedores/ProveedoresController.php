<?php

namespace App\Http\Controllers\Contabilidad\Proveedores;
use App\Http\Controllers\Controller;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\Comprobante;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\Impuesto;
use App\Models\General\MetodoTesoreria;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProveedoresController extends Controller
{
    ////LISTAR PROVEEDORES CON SALDO
   public function proveedoresConSaldo()
    {
        $proveedores = Proveedor::with([
            'padron',
            'comprobantes.detalles',
            'comprobantes.tipoComprobante',
            'comprobantes.ordenesTesoreria',
            'comprobantes.comprobantesAplicados',
        ])->get();

        $proveedores = $proveedores->map(function ($p) {
            $totalDebe = 0;
            $totalHaber = 0;
            $pagosConfirmados = 0;

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

                // Ordenes de pago (siempre cuentan si están confirmadas)
                foreach ($comp->ordenesTesoreria as $op) {
                    if ($op->estado === 'Confirmado') {
                        $pagosConfirmados += (float) ($op->pivot->importe_aplicado ?? 0);
                    }
                }

                // Comprobantes Aplicados (siempre cuentan si están confirmadas)
                foreach ($comp->comprobantesAplicados as $compAplicado) {

                        $pagosConfirmados += (float) ($compAplicado->pivot->importe_aplicado ?? 0);

                }
            }

            // Saldo final
            $p->saldo = ($totalDebe - $totalHaber) - $pagosConfirmados;

            return $p;
        });

        return response()->json($proveedores);
    }


    ////LISTAR FACTURAS PENDIENTES DE PAGO DE UN PROVEEDOR
    public function facturasPendientes($proveedorId)
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
            ->where('tipo_id', $proveedorId)
            ->where('estado', '!=', 'Anulado')
            ->get()
            ->filter(function ($comp) {
                $totalFactura = (float) $comp->detalles->sum('importe');
                $totalPagado = (float) $comp->ordenesTesoreria->sum(fn($op) => $op->pivot->importe_aplicado ?? 0);
                $totalComprobantesAplicados = (float) $comp->comprobantesAplicados->sum(fn($compAplicado) => $compAplicado->pivot->importe_aplicado ?? 0);
                return $totalFactura > $totalPagado + $totalComprobantesAplicados;
            })
            ->values();

        return response()->json($comprobantes);
    }

    ////LISTAR CUENTA CORRIENTE DE UN PROVEEDOR
    public function cuentaCorriente($proveedorId)
    {
        $comprobantes = Comprobante::with([
            'comprobantesAplicados',
            'tipoComprobante',
            'detalles',
            'ordenesTesoreria' => function ($q) {
            $q->with([
                'metodoPago',
            ])->withPivot(['importe_aplicado', 'fecha_aplicacion']);
            },
            ])
            ->where('tipo_id', $proveedorId)
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
            foreach ($comp->ordenesTesoreria as $pago) {
                $estadoPago = strtolower($pago->estado ?? '');
                $importeAplicado = (float) ($pago->pivot->importe_aplicado ?? 0);

                $importePago = (float) $pago->importe;
                $tipoPago = $pago->metodoPago->descripcion ?? '';

                // 🔹 Si el pago tiene importe aplicado, agregamos un registro de “parcial”
                if ($importeAplicado > 0) {
                    $movimientos->push([
                        'grupo_id' => $comp->id,
                        'fecha' => $pago->pivot->fecha_aplicacion ?? $pago->fecha_pago,
                        'tipo' => 'Orden de Pago ' . $tipoPago,
                        'numero' => '('.$pago->id.')' . ' OP-' . str_pad($pago->id, 4, '0', STR_PAD_LEFT),
                        'descripcion' => 'Importe aplicado a ' . ($tipo->nombre ?? '') . ' ' . $comp->numero_factura,
                        'debe' => 0.0,
                        'haber' => (float) $importeAplicado,
                        'estado' => ucfirst($estadoPago),
                        'afecta_saldo' => true, // 🔸 El parcial SÍ afecta saldo
                    ]);
                }




                // 🔹 La orden de pago completa
               /* $afectaSaldo = $estadoPago === 'confirmado'; // solo confirmadas afectan saldo
                $movimientos->push([
                    'grupo_id' => $comp->id,
                    'fecha' => $pago->fecha_pago,
                    'tipo' => 'Orden de Pago',
                    'numero' => '('.$pago->id.')' . ' OP-' . str_pad($pago->id, 4, '0', STR_PAD_LEFT),
                    'descripcion' => 'Pago aplicado a ' . ($tipo->nombre ?? '') . ' ' . $comp->numero_factura,
                    'debe' => 0.0,
                    'haber' => (float) $importePago,
                    'estado' => ucfirst($estadoPago),
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


    ////LISTAR ÓRDENES DE PAGO DE UN PROVEEDOR
    public function pagosProveedores()
    {
        $ordenesTesoreria = OrdenTesoreria::with([
            'plan',
            'moneda',
            'metodoPago',
            'bancoOrigen',
            'cuentaOrigen',
            'tarjetaOrigen',
            'tarjetaOrigen.cuentaBancaria',
            'tarjetaOrigen.cuentaBancaria.banco',
            'comprobantes',
            'comprobantes.tipoComprobante',
            'comprobantes.tipoMoneda',
            'comprobantes.proveedor',
        ])->get();
        return Inertia::render('Contabilidad/Pagos/Index', [
            'ordenesTesoreria' => $ordenesTesoreria,
            'proveedores' => Proveedor::select('id', 'nombre_fantasia', 'razon_social')->orderBy('nombre_fantasia')->get(),
            'metodosPago' => MetodoTesoreria::select('id', 'nombre')->get(),
            'monedas' => TipoMoneda::select('id', 'descripcion')->get(),
            'tiposComprobante' => TipoComprobante::select('id', 'nombre')->get(),
            'bancos' => Banco::select('id', 'banco')->get(),
            'cuentasBancarias' => CuentaBancaria::select('id', 'banco_id', 'numero_cuenta', 'tipo_cuenta')->get(),
            'tarjetas' => Tarjeta::select('id', 'cuenta_bancaria_id', 'numero_tarjeta', 'tipo')->get(),

        ]);
    }

    //// LISTAR REEMBOLSOS
    public function reembolsos()
    {

        $proveedores = Proveedor::with([
            'padron',
            'comprobantes.detalles',
            'comprobantes.tipoComprobante',
            'comprobantes.ordenesVenta',
            'comprobantes.comprobantesAplicados',
            'comprobantes.detalles.impuestos',
            'comprobantes.archivos'
        ])->get();

        return Inertia::render('Contabilidad/Proveedores/Reembolso/Index', [
            'proveedores' => $proveedores,
            'impuestos' => Impuesto::all(),

        ]);
    }

    ////LISTAR TODAS LAS FACTURAS DE UN PROVEEDOR
    public function facturasTotales($proveedorId)
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
            ->where('tipo_id', $proveedorId)
            ->where('estado', '!=', 'Anulado')
            ->get()
            ->values();

        return response()->json($comprobantes);
    }




}
