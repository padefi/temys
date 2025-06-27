<?php

namespace App\Http\Controllers\Compras\CotizacionesOrdenes;
use App\Http\Controllers\Controller;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\General\TipoMoneda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CotizacionesOrdenesController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/CotizacionesOrdenes/Index', [

            //'module' => '3',
        ]);

    }

    public function nuevaCotizacion()
    {
        return Inertia::render('Compras/CotizacionesOrdenes/NuevaCotizacion/Index', [
            'proveedores' => [
            'data' => Proveedor::with('padron')->get() // Estructura que espera el frontend
            ],
            'tipoMonedas' => TipoMoneda::all(),
            //'module' => '3',
        ]);
    }


}
