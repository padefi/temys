<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\Tarjeta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TarjetaController extends Controller
{
    ////LISTAR TARJETAS
    public function index()
    {
        return Tarjeta::with(['cuentaBancaria.banco' => function ($q) {
            $q->select('id', 'banco');
        }])
        ->select('id', 'tipo', 'numero_tarjeta', 'cuenta_bancaria_id')
        ->get();
    }
}
