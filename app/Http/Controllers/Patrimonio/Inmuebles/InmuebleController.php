<?php

namespace App\Http\Controllers\Patrimonio\Inmuebles;

use App\Http\Controllers\Controller;
use App\Models\Patrimonio\Inmuebles\Inmueble;
use App\Models\Patrimonio\Inmuebles\InmuebleContrato;
use App\Models\Patrimonio\Inmuebles\InmueblesEscritura;
use App\Models\Patrimonio\Inmuebles\InmuebleTipo;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoContrato;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoEstado;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoOcupacions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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


    private function crearDetallePorTipo(Request $request, Inmueble $inmueble)
    {
        switch ($request->tipo_contrato) {
            case 1: // Casa
                InmuebleContrato::create([
                    'inmuebles_id' => $inmueble->id,
                    'inmuebles_tipo_contrato_id' => $request->tipo_contrato,
                    'fecha_contrato' => $request->fecha_contrato,
                    'fecha_inicio' => $request->fecha_inicio,
                    'fecha_final' => $request->fecha_fin,
                    'importe' => $request->importe,
                    'observacion' => $request->observacion,
                ]);
                break;

            case 2: // Terreno
                InmuebleContrato::create([
                    'inmuebles_id' => $inmueble->id,
                    'inmuebles_tipo_contrato_id' => $request->tipo_contrato,
                    'fecha_contrato' => $request->fecha_contrato,
                    'fecha_inicio' => $request->fecha_inicio,
                    'fecha_final' => $request->fecha_fin,
                    'importe' => $request->importe,
                    'observacion' => $request->observacion,
                ]);
                break;

            case 3: // Departamento
                InmueblesEscritura::create([
                    'inmuebles_id' => $inmueble->id,
                    'nro_escritura' => $request->num_escritura,
                    'fecha_escritura' => $request->fecha_escritura,
                    'fecha_inscripcion' => $request->fecha_inscripcion,
                    'folio' => $request->folio,
                    'tomo' => $request->tomo,
                    'observacion' => $request->observacion,
                ]);
                break;
        }
    }



    public function createInmueble(Request $request)
    {

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
        $this->crearDetallePorTipo($request, $newInmueble);

        DB::commit();
        return response()->json([
            'message' => 'Solicitud creada con múltiples productos.',
            'newInmueble' => $newInmueble->id,
            'success' => true

        ], 201);
    }
}
