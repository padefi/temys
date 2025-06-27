<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\TipoMoneda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TipoMonedaController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/Proveedores/Index', [
            'tipoMoneda' => TipoMoneda::all()
        ]);
    }


}
