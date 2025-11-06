<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\General\CondicionVenta;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComprasController extends Controller
{
    ////DASHBOARD DE COMPRAS
    public function index()
    {
        return Inertia::render('Compras/Dashboard/Index');
    }

    ////LISTAR CONDICIONES DE VENTA
    public function condicionesVenta()
    {
        return CondicionVenta::select('id', 'nombre')->orderBy('nombre')->get();
    }


}
