<?php

namespace App\Http\Controllers\Contabilidad\Proveedores;
use App\Http\Controllers\Controller;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenPago;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoPago;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Inertia\Inertia;

class ProveedoresController extends Controller
{
    ////LISTAR PROVEEDORES CON SALDO
    public function proveedoresConSaldo()
    {
        $proveedores = Proveedor::with([
            'padron',
            'comprobantesProveedores.detalles',
            'comprobantesProveedores.tipoComprobante',
            'comprobantesProveedores.ordenesPago'
        ])->get();

        $proveedores = $proveedores->map(function ($p) {
            $totalDebe = 0;
            $totalHaber = 0;
            $pagosConfirmados = 0;

            foreach ($p->comprobantesProveedores as $comp) {

                // 🔹 Determinar el signo según el tipo de comprobante
                $signo = $comp->tipoComprobante->signo ?? 1; // puede ser 1 o -1
                $afectaSaldo = $comp->tipoComprobante->afecta_saldo ?? true;

                if ($afectaSaldo) {
                    // 🔹 Calcular el importe total del comprobante en base a los detalles
                    $importeComprobante = $comp->detalles->sum(function ($d) {
                        $cantidad = (float) $d->cantidad;
                        $precioUnitario = (float) $d->precio_unitario;
                        $descuento = (float) ($d->porcentaje_descuento ?? 0);
                        $importe = $cantidad * $precioUnitario;
                        return $importe - ($importe * $descuento / 100);
                    });

                    // Aplica el signo según el tipo de comprobante
                    if ($signo > 0) {
                        $totalDebe += $importeComprobante;
                    } else {
                        $totalHaber += $importeComprobante;
                    }
                }

                // 🔹 Pagos confirmados vinculados
                foreach ($comp->ordenesPago as $op) {
                    if ($op->estado === 'Confirmado') {
                        $pagosConfirmados += (float) ($op->pivot->importe_aplicado ?? 0);
                    }
                }
            }

            // 🔹 Calcular saldo final
            $p->saldo = ($totalDebe - $totalHaber) - $pagosConfirmados;

            return $p;
        });

        return response()->json($proveedores);
    }

    ////LISTAR FACTURAS PENDIENTES DE PAGO DE UN PROVEEDOR
    public function facturasPendientes($proveedorId)
    {
        $comprobantes = ComprobanteProveedor::with([
            'tipoComprobante',
            'detalles',
            'tipoMoneda',
            'ordenesPago' => function ($q) {
                $q->withPivot(['importe_aplicado'])
                ->where('estado', 'pendiente');
                }
            ])
            ->where('proveedor_id', $proveedorId)
            ->where('estado', '!=', 'Anulado')
            ->get()
            ->filter(function ($comp) {
                $totalFactura = (float) $comp->detalles->sum('importe');
                $totalPagado = (float) $comp->ordenesPago->sum(fn($op) => $op->pivot->importe_aplicado ?? 0);
                return $totalFactura > $totalPagado;
            })
            ->values();

        return response()->json($comprobantes);
    }

    ////LISTAR CUENTA CORRIENTE DE UN PROVEEDOR
    public function cuentaCorriente($proveedorId)
    {
        $comprobantes = ComprobanteProveedor::with([
            'tipoComprobante',
            'detalles',
            'ordenesPago' => function ($q) {
            $q->with([
                'metodoPago',
            ])->withPivot(['importe_aplicado', 'fecha_aplicacion']);
            },
            ])
            ->where('proveedor_id', $proveedorId)
            ->where('estado', '!=', 'Anulado')
            ->orderBy('fecha_factura', 'asc')
            ->get();

        $movimientos = collect();

        foreach ($comprobantes as $comp) {
            $tipo = $comp->tipoComprobante;
            $estadoComp = ucfirst(strtolower($comp->estado ?? ''));
            $total = (float) $comp->detalles->sum('importe');

            // === COMPROBANTE ===
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

            // === ÓRDENES DE PAGO (debajo del comprobante)
            foreach ($comp->ordenesPago as $pago) {
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
        $ordenesPago = OrdenPago::with([
            'planPago',
            'moneda',
            'metodoPago',
            'bancoOrigen',
            'cuentaOrigen',
            'tarjetaOrigen',
            'tarjetaOrigen.cuentaBancaria',
            'tarjetaOrigen.cuentaBancaria.banco',
            'comprobantesProveedores',
            'comprobantesProveedores.tipoComprobante',
            'comprobantesProveedores.tipoMoneda',
            'comprobantesProveedores.proveedor',
        ])->get();
        return Inertia::render('Contabilidad/Pagos/Index', [
            'ordenesPago' => $ordenesPago,
            'proveedores' => Proveedor::select('id', 'nombre_fantasia', 'razon_social')->orderBy('nombre_fantasia')->get(),
            'metodosPago' => MetodoPago::select('id', 'nombre')->get(),
            'monedas' => TipoMoneda::select('id', 'descripcion')->get(),
            'tiposComprobante' => TipoComprobante::select('id', 'nombre')->get(),
            'bancos' => Banco::select('id', 'banco')->get(),
            'cuentasBancarias' => CuentaBancaria::select('id', 'banco_id', 'numero_cuenta', 'tipo_cuenta')->get(),
            'tarjetas' => Tarjeta::select('id', 'cuenta_bancaria_id', 'numero_tarjeta', 'tipo')->get(),

        ]);
    }

    /*public function index(Request $request)
    {
        $query = OrdenPago::with([
            'comprobantesProveedores.proveedor',
            'metodoPago',
            'moneda',
            'planPago',
            'comprobantesProveedores.tipoComprobante',
        ]);

        // 🔹 Filtros
        if ($request->filled('proveedor_id')) {
            $query->where('proveedor_id', $request->proveedor_id);
        }

        if ($request->filled('metodo_pago_id')) {
            $query->where('metodo_pago_id', $request->metodo_pago_id);
        }

        if ($request->filled('moneda_id')) {
            $query->where('moneda_id', $request->moneda_id);
        }

        if ($request->filled('numero_factura')) {
            $query->whereHas('comprobantesProveedores', function ($q) use ($request) {
                $q->where('numero_factura', 'like', "%{$request->numero_factura}%")
                ->orWhere('punto_venta', 'like', "%{$request->numero_factura}%");
            });
        }

        if ($request->filled('tipo_comprobante_id')) {
            $query->whereHas('comprobantesProveedores', function ($q) use ($request) {
                $q->where('tipo_comprobante_id', $request->tipo_comprobante_id);
            });
        }

        if ($request->filled('fecha_desde') && $request->filled('fecha_hasta')) {
            $query->whereBetween('fecha_pago', [$request->fecha_desde, $request->fecha_hasta]);
        }

        $ordenesPago = $query->latest()->get();

        return Inertia::render('Contabilidad/OrdenesPago/Index', [
            'ordenesPago' => $ordenesPago,
            'filtros' => $request->only([
                'proveedor_id', 'metodo_pago_id', 'moneda_id', 'numero_factura', 'tipo_comprobante_id', 'fecha_desde', 'fecha_hasta'
            ]),
            'proveedores' => Proveedor::select('id', 'nombre_fantasia')->orderBy('nombre_fantasia')->get(),
            'metodosPago' => MetodoPago::select('id', 'nombre')->get(),
            'monedas' => TipoMoneda::select('id', 'descripcion')->get(),
            'tiposComprobante' => TipoComprobante::select('id', 'nombre')->get(),
        ]);
    }*/


}
