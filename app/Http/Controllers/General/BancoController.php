<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\Banco;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BancoController extends Controller
{
    ////LISTAR BANCOS
    public function index()
    {
            return Banco::with(['cuentaBancaria' => function ($query) {
                $query->where('activo', true);
            }])->get();
    }


}
