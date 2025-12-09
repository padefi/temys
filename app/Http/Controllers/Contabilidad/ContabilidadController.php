<?php

namespace App\Http\Controllers\Contabilidad;
use App\Http\Controllers\Controller;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenPago;
use App\Models\Compras\PlanPago;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoPago;
use App\Models\General\Tarjeta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'proveedor_id' => 'required|integer',
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
        ->when($request->proveedor_id, function ($q) use ($request) {
            $q->whereHas('partidas.comprobantes', function ($q2) use ($request) {
                $q2->where('proveedor_id', $request->proveedor_id);
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
            'proveedor_id' => $request->proveedor_id,

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





}
