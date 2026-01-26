<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\General\CondicionVenta;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VentasController extends Controller
{
    ////DASHBOARD DE VENTAS
    public function index()
    {
        return Inertia::render('Ventas/Dashboard/Index');
    }

    ////LISTAR CONDICIONES DE VENTA
    public function condicionesVenta()
    {
        return CondicionVenta::select('id', 'nombre')->orderBy('nombre')->get();
    }


}
