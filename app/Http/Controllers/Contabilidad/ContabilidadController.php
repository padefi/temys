<?php

namespace App\Http\Controllers\Contabilidad;
use App\Http\Controllers\Controller;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenPago;
use App\Models\Compras\PlanPago;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoPago;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
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
            'ordenPago',
            'proveedor',
        ])->get();

       return Inertia::render('Contabilidad/Conciliar/Index', [
            'movimientosTesoreria' => $movimientosTesoreria,
            'proveedores' => Proveedor::select('id', 'nombre_fantasia', 'razon_social')->orderBy('nombre_fantasia')->get(),
            'metodosPago' => MetodoPago::select('id', 'nombre')->get(),
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

        $userId = auth()->id();
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






}
