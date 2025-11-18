<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\TipoComprobante;

class TipoComprobanteController extends Controller
{
    ////LISTAR TIPOS DE COMPROBANTE
    public function index()
    {
        return TipoComprobante::select('id', 'nombre')->orderBy('nombre')->get();
    }


}
