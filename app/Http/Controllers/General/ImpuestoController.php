<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\Impuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ImpuestoController extends Controller
{
    ////LISTAR IMPUESTOS
    public function index()
    {
        return Inertia::render('Compras/Proveedores/Index', [
            'impuesto' => Impuesto::all()
        ]);
    }


}
