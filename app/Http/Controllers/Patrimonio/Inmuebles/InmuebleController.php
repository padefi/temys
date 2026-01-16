<?php

namespace App\Http\Controllers\Patrimonio\Inmuebles;

use App\Http\Controllers\Controller;
use App\Models\Patrimonio\Inmuebles\Inmueble;
use App\Models\Patrimonio\Inmuebles\InmuebleTipo;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoContrato;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoEstado;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoOcupacions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InmuebleController extends Controller
{
    public function index()
    {
        return Inertia::render('Patrimonio/Inmuebles/Inmueble', [
            'modulo' => 'patrimonio',
        ]);
    }

    public function showEstados()
    {
        $estados = InmuebleTipoEstado::all();
        return response()->json($estados);
    }

    public function showTiposInmuebles()
    {
        $tiposInmuebles = InmuebleTipo::all();
        return response()->json($tiposInmuebles);
    }
    public function showTiposOcupacion()
    {
        $tiposOcupacion = InmuebleTipoOcupacions::all();
        return response()->json($tiposOcupacion);
    }

    public function showTipoContrato()
    {
        $tiposContrato = InmuebleTipoContrato::all();
        return response()->json($tiposContrato);
    }

    public function createInmueble(Request $request)
    {
        echo var_dump($request->all());

        $newInmueble = Inmueble::create([
            'num_partida' => $request->input('num_partida'),
            'estado_id' => $request->input('estado_id'),
            'nombre_completo' => $request->input('nombre_completo'),
            'nombre_fantasia' => $request->input('nombre_fantasia'),
            'id_calle' => $request->input('calle_id'),
            'numero' => $request->input('numero'),
            'tipo_inmueble_id' => $request->input('tipo_inmueble_id'),
            'tipo_ocupacion_id' => $request->input('tipo_ocupacion_id'),
            'superficie_cubierta' => $request->input('superficie_cubierta'),
            'superficie_libre' => $request->input('superficie_libre'),
            'superficie_total' => $request->input('superficie_total'),
            'fecha_creacion' => now(),
            'usuario_creacion' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Solicitud creada con múltiples productos.',
            'newInmueble' => $newInmueble->id,
            'success' => true

        ], 201);
    }
}
