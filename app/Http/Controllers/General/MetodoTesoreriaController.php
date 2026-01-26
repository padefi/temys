<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\MetodoTesoreria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MetodoTesoreriaController extends Controller
{
    ////LISTAR MÉTODOS DE PAGO
    public function index()
    {
        return MetodoTesoreria::all();
    }


}
