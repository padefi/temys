<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Models\Patrimonio\Inmuebles\Calle;
use App\Models\Patrimonio\Inmuebles\Localidad;
use App\Models\Patrimonio\Inmuebles\Provincia;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
    public function provincias()
    {
        return response()->json(Provincia::select('id', 'nombre')->orderBy('nombre')->get());
    }

    public function localidades($provinciaId)
    {
        return response()->json(Localidad::where('provincia_id', $provinciaId)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get());
    }

    public function calles($localidadId)
    {
        return response()->json(Calle::where('localidad_id', $localidadId)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get());
    }
}
