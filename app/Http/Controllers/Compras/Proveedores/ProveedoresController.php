<?php

namespace App\Http\Controllers\Compras\Proveedores;
use App\Http\Requests\Compras\ProveedorUpdateRequest;
use App\Http\Controllers\Controller;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ProveedorCbu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Padron\Padron;
use App\Models\Padron\Cliente\Cliente;
use App\Models\General\Nacionalidad;
use App\Models\Padron\CondicionIva;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;
use App\Models\Padron\EntidadFinanciera;
use App\Models\General\TipoMoneda;

class ProveedoresController extends Controller
{
    ////LISTAR PROVEEDORES
    public function index()
    {
        return Inertia::render('Compras/Proveedores/Index', [
            'proveedores' => [
            'data' => Proveedor::with('padron')->get()
            ],
            'nacionalidades' => Nacionalidad::orderBy('orden')->get([
                'id',
                'id_nac',
                'nacionalidad',
            ]),
            'condicionesIva' => CondicionIva::orderBy('descripcion')->get([
                'id',
                'descripcion',
            ]),
            'actividades' => ActividadEconomicaProveedor::orderBy('descripcion')->get([
                'id',
                'descripcion',
            ]),
            'entidadesFinancieras' => EntidadFinanciera::where('habilitado', 1)->orderBy('descripcion')->get([
                'id', 
                'descripcion', 
                'tipo', 
                'clave_unica', 
                'habilitado'
            ]),
            'tiposMoneda' => TipoMoneda::where('habilitado', 1)->orderBy('descripcion')->get([
                'id', 
                'codigo', 
                'descripcion', 
                'simbolo', 
                'pais_origen', 
                'habilitado'
            ]),
        ]);
    }

    ////FORM CREAR PROVEEDOR
    public function create()
    {
        return Inertia::render('Compras/Proveedores/Crear', [
            'nacionalidades' => Nacionalidad::orderBy('orden')->get([
                'id',
                'id_nac',
                'nacionalidad',
            ]),
            'condicionesIva' => CondicionIva::orderBy('descripcion')->get([
                'id',
                'descripcion',
            ]),
            'actividades' => ActividadEconomicaProveedor::orderBy('descripcion')->get([
                'id',
                'descripcion',
            ]),
            'entidadesFinancieras' => EntidadFinanciera::where('habilitado', 1)->orderBy('descripcion')->get([
                'id', 
                'descripcion', 
                'tipo', 
                'clave_unica', 
                'habilitado'
            ]),
            'tiposMoneda' => TipoMoneda::where('habilitado', 1)->orderBy('descripcion')->get([
                'id', 
                'codigo', 
                'descripcion', 
                'simbolo', 
                'pais_origen', 
                'habilitado'
            ]),
        ]);
    }

    ////CREAR PROVEEDOR
    public function store(Request $request)
    {
        /* $validated = $request->validate([
            'razon_social' => 'required|string|max:100',
            'nombre_fantasia' => 'nullable|string|max:100',
            'padron.documento' => 'required|string|max:50',
            'padron.tipo_documento' => 'required|string|max:20',
        ]); */

        $validated = $request->validate([
            'tipo_documento'   => 'required|string',
            'documento'        => ['required', 'regex:/^[0-9]+$/', 'max:20'],
            'nacionalidad'     => 'nullable|integer|exists:nacionalidades,id',
            'razon_social'     => 'required|string|max:100',
            'nombre_fantasia'  => 'nullable|string|max:100',
            'tipo'             => ['required', Rule::in(['Humana', 'Jurídica'])],
            'padron_id'        => 'nullable|integer|exists:padron,id',
        ]);

        DB::beginTransaction();
        try {
            // 1) Resolver padrón (reutilizar o crear)
            if (!empty($validated['padron_id'])) {
                // Reutilizamos padrón existente
                $padron = Padron::findOrFail($validated['padron_id']);
                // nacionalidad SOLO lectura en caso padron_only, así que NO la tocamos
            } else {
                // Caso not_found → creamos nuevo padrón
                $padron = Padron::create([
                    'tipo_documento' => $validated['tipo_documento'],
                    'documento'      => $validated['documento'],
                    'nacionalidad'   => empty($validated['nacionalidad']) ? null : $validated['nacionalidad'],
                ]);
            }

            /* $padron = \App\Models\Padron\Padron::create([
                'tipo_documento' => $validated['padron']['tipo_documento'],
                'documento' => $validated['padron']['documento'],
            ]);*/

            $proveedor = Proveedor::create([
                'id_padron' => $padron->id,
                'razon_social' => $validated['razon_social'],
                'nombre_fantasia' => $validated['nombre_fantasia'] ?? null,
                'tipo' => $validated['tipo'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Proveedor creado correctamente');
        } catch(\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al crear proveedor: ' . $e->getMessage()])->withInput();
        }
    }

    ////ACTUALIZAR PROVEEDOR
    public function update(ProveedorUpdateRequest $request, Proveedor $proveedor)
    {

        try {
         // Los datos ya están validados cuando llegan aquí
        $validated = $request->validated();

        // Actualizar proveedor
        // Actualizar
        $proveedor->update($validated);

        // Actualizar padrón si existe
        if ($proveedor->padron) {
            $proveedor->padron()->update($validated['padron']);
        } else {
            $proveedor->padron()->create($validated['padron']);
        }

        return redirect()->back()->with('success', 'Proveedor actualizado');


        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()])
                ->withInput();
        }
    }

    //// LISTAR CBU DE PROVEEDOR
    public function cbus($proveedorId)
    {
        $proveedor = Proveedor::findOrFail($proveedorId);
       return response()->json(
            $proveedor->cbu()
            ->select('id', 'tipo_clave', 'clave', 'alias', 'predeterminado')
            ->orderByDesc('predeterminado')
            ->get()
        );
    }

    ////VERIFICA EN PADRÓN
    public function verifyPadron(Request $request)
    {
        $request->validate([
            'tipo_documento' => 'required|string',
            'documento'      => 'required|string',
        ]);

        $tipo      = $request->input('tipo_documento');
        $documento = $request->input('documento');

        $padron = Padron::where('tipo_documento', $tipo)
            ->where('documento', $documento)
            ->first();

        if (!$padron) {
            // Caso A: NO existe en padrón
            return response()->json([
                'status' => 'not_found',
            ]);
        }

        $clienteExiste    = Cliente::where('id_padron', $padron->id)->exists();
        $proveedorExiste  = Proveedor::where('id_padron', $padron->id)->exists();

        if ($proveedorExiste) {
            // Caso D: ya existe como proveedor (no válido)
            return response()->json([
                'status'       => 'proveedor',
                'padron_id'    => $padron->id,
                'nacionalidad' => $padron->nacionalidad,
                'cliente'      => $clienteExiste,
            ]);
        }

        if ($clienteExiste) {
            // Caso C: existe como cliente, no como proveedor
            return response()->json([
                'status'       => 'cliente',
                'padron_id'    => $padron->id,
                'nacionalidad' => $padron->nacionalidad,
            ]);
        }

        // Caso B: existe solo en padrón
        return response()->json([
            'status'       => 'padron_only',
            'padron_id'    => $padron->id,
            'nacionalidad' => $padron->nacionalidad,
        ]);
    }

}
