<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\MetodoPago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MetodoPagoController extends Controller
{
    ////LISTAR MÉTODOS DE PAGO
    public function index()
    {
        return MetodoPago::all();
    }


}
