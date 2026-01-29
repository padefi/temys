<?php

namespace App\Http\Controllers\Patrimonio\Inmuebles;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\BranchResource;
use App\Http\Resources\Patrimonio\InmueblesResource;
use App\Models\ControlAcceso\Branch;
use App\Models\Patrimonio\Inmuebles\Inmueble;
use App\Models\Patrimonio\Inmuebles\InmuebleContacto;
use App\Models\Patrimonio\Inmuebles\InmuebleContrato;
use App\Models\Patrimonio\Inmuebles\InmueblesEscritura;
use App\Models\Patrimonio\Inmuebles\InmueblesHistorialCatastrales;
use App\Models\Patrimonio\Inmuebles\InmuebleTipo;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoContacto;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoContrato;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoEstado;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoOcupacions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class InmuebleController extends Controller
{
    public function index(Request $request)
    {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        $inmuebles = QueryBuilder::for(
            Inmueble::query()
                ->select(
                    'inmuebles.*',
                    'u.name as usuario_creacion',
                    'ao.name as seccional',
                    'p.descripcion as tipo_inmueble',
                    'o.descripcion as tipo_ocupacion',
                    'e.descripcion as estado'
                )
                ->join('users as u', 'inmuebles.usuario_creacion', '=', 'u.id')
                ->leftJoin('branches as ao', 'inmuebles.id_seccionales', '=', 'ao.id')
                ->leftJoin('inmueble_tipos as p', 'inmuebles.tipo_inmueble_id', '=', 'p.id')
                ->leftJoin('inmueble_tipo_ocupacions as o', 'inmuebles.tipo_ocupacion_id', '=', 'o.id')
                ->leftJoin('inmueble_tipo_estados as e', 'inmuebles.estado_id', '=', 'e.id')
        )
            ->with([
                'contactos.tipoContacto' 
            ])
            ->allowedFilters([
                AllowedFilter::callback('nombres_inmueble', function ($query, $value) {
                    $query->where('ao.nombre', 'LIKE', "%{$value}%");
                }),
            ])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();


        return Inertia::render('Patrimonio/Inmuebles/InmueblesManagement', [
            'inmuebles' => InmueblesResource::collection($inmuebles),
        ]);
    }

    public function newInmuebles()
    {
        return Inertia::render('Patrimonio/Inmuebles/CargarNuevoInmueble/Inmueble', []);
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

    public function showTipoContacto()
    {
        $tiposContacto = InmuebleTipoContacto::all();
        return response()->json($tiposContacto);
    }


    public function showBranch()
    {
        $branches = Branch::all();

        return response()->json($branches);
    }

    private function crearDetallePorTipo(Request $request, Inmueble $inmueble)
    {
        switch ($request->tipo_contrato) {
            case 1: // comodato
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

            case 2: // alquiler
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

            case 3: // escritura
                $escritura = InmueblesEscritura::create([
                    'inmuebles_id' => $inmueble->id,
                    'nro_escritura' => $request->num_escritura,
                    'fecha_escritura' => $request->fecha_escritura,
                    'fecha_inscripcion' => $request->fecha_inscripcion,
                    'folio' => $request->folio,
                    'tomo' => $request->tomo,
                    'observacion' => $request->observacion,
                ]);

                InmueblesHistorialCatastrales::create([
                    'id_escritura' => $escritura->id,
                    'circunscripcion' => $request->circunscripcion,
                    'manzana' => $request->manzana,
                    'parcela' => $request->parcela,
                    'poligono' => $request->poligono,
                    'zona' => $request->zona,
                    'partida' => $request->partida,
                    'valuacion_fiscal' => $request->valuacion_fiscal,
                ]);
                break;
        }
    }


    public function createInmueble(Request $request)
    {
        DB::beginTransaction();

        try {
            $newInmueble = Inmueble::create([
                'num_partida' => $request->input('num_partida'),
                'id_seccionales' => $request->input('id_seccionales'),
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

            // Guardar contactos usando la relación
            $this->guardarContactos($newInmueble, $request->input('contactos', []));

            $this->crearDetallePorTipo($request, $newInmueble);

            DB::commit();

            return response()->json([
                'message' => 'Inmueble creado con éxito.',
                'newInmueble' => $newInmueble->id,
                'success' => true
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al crear el inmueble.',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Guardar contactos del inmueble
     */
    private function guardarContactos(Inmueble $inmueble, array $contactos)
    {
        foreach ($contactos as $contacto) {
            InmuebleContacto::create([
                'inmuebles_id' => $inmueble->id,
                'inmuebles_tipo_contacto_id' => $contacto['idType'],
                'contacto' => $contacto['value'],
                'descripcion' => $contacto['description'] ?? null,
            ]);
        }
    }
}
