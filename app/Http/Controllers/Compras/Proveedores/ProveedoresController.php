<?php

namespace App\Http\Controllers\Compras\Proveedores;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\General\Nacionalidad;
use App\Models\General\TipoMoneda;
use App\Models\General\TipoContacto;
use App\Models\Padron\Padron;
use App\Models\Padron\CondicionIva;
use App\Models\Padron\EntidadFinanciera;
use App\Models\Padron\PadronAdjuntoRequerido;
use App\Models\Padron\PadronAdjuntoOpcional;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;

class ProveedoresController extends Controller
{
    //Listar Proveedores
    public function index()
    {
        $proveedores = Proveedor::with([
            'padron',
            'datosBancarios.entidadFinanciera:id,descripcion,tipo,clave_unica',
            'datosBancarios.tipoMoneda:id,codigo,descripcion,simbolo,pais_origen',
            'domicilios',
            'contactos',
            'actividadesEconomicas:id,descripcion',
            'condicionesIva:id,descripcion',
            'adjuntosRequeridos.tipoAdjunto:id,descripcion',
            'adjuntosOpcionales.tipoAdjunto:id,descripcion',
        ])->get()->map(function ($proveedor) {

            $callesIds = $proveedor->domicilios
                ->pluck('calle_id')
                ->filter(fn ($id) => filled($id))
                ->map(fn ($id) => trim((string) $id))
                ->unique()
                ->values();
            //Trae calles
            $calles = DB::table('georef_calles')
                ->whereIn('id', $callesIds->all())
                ->get()
                ->mapWithKeys(fn ($calle) => [
                    trim((string) $calle->id) => $calle
                ]);

            return [
                'id' => $proveedor->id,
                'id_padron' => $proveedor->id_padron,
                'tipo' => $proveedor->tipo,
                'razon_social' => $proveedor->razon_social,
                'nombre_fantasia' => $proveedor->nombre_fantasia,
                'anotaciones' => null,

                'padron' => $proveedor->padron ? [
                    'id' => $proveedor->padron->id,
                    'tipo_documento' => $proveedor->padron->tipo_documento,
                    'documento' => $proveedor->padron->documento,
                    'nacionalidad' => $proveedor->padron->nacionalidad,
                ] : null,

                'condicion_iva_id' => optional($proveedor->condicionesIva->first())->id,

                'actividades' => $proveedor->actividadesEconomicas->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'descripcion' => $a->descripcion,
                    ];
                })->values(),

                'bancarios' => $proveedor->datosBancarios->map(function ($b) {
                    return [
                        'id' => $b->id,
                        'entidad_financiera_id' => $b->entidad_financiera,
                        'tipo_clave' => $b->tipo_clave === 'Undefined' ? '' : $b->tipo_clave,
                        'clave' => $b->clave ?? '',
                        'alias' => $b->alias ?? '',
                        'moneda_id' => $b->moneda,
                        'tipo_cuenta' => $b->tipo_cuenta === 'Undefined' ? '' : $b->tipo_cuenta,
                        'predeterminado' => (bool) $b->predeterminado,
                    ];
                })->values(),

                //Mapear domicilios con datos enriquecidos
                'domicilios' => $proveedor->domicilios->map(function ($d) use ($calles) {
                    $calleId = trim((string) $d->calle_id);
                    $calle = $calles->get($calleId);
                
                    return [
                        'id' => $d->id,
                        'tipo_domicilio' => $d->tipo_domicilio,
                        'calle_id' => $calleId,
                        'altura' => (int) $d->altura,
                        'predeterminado' => (bool) $d->predeterminado,
                        'codigo_postal' => $d->codigo_postal,
                        'piso' => $d->piso,
                        'departamento' => $d->departamento,
                        'observaciones' => $d->observaciones,
                        'calle_nombre' => $calle?->nombre,
                        'localidad' => $calle?->localidad_nombre,
                        'provincia' => $calle?->provincia_nombre,
                        'lat' => null,
                        'lon' => null,
                    ];
                })->values(),

                'contactos' => $proveedor->contactos->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'tipo_contacto' => $c->tipo_contacto,
                        'contacto' => $c->contacto,
                        'predeterminado' => (bool) $c->predeterminado,
                    ];
                })->values(),

                'adjuntos_requeridos' => $proveedor->adjuntosRequeridos->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'tipo_adjunto' => $a->tipo_adjunto,
                        'descripcion' => optional($a->tipoAdjunto)->descripcion,
                        'nombre_archivo' => $a->nombre_archivo,
                        'ruta_archivo' => $a->ruta_archivo,
                        'fecha_adjunto' => $a->fecha_adjunto?->format('Y-m-d'),
                        'url' => route('proveedores.adjuntos.show', $a->id),
                        'size' => !empty($a->ruta_archivo) && Storage::disk('local')->exists($a->ruta_archivo)
                            ? Storage::disk('local')->size($a->ruta_archivo)
                            : null,
                    ];
                })->values(),

                'adjuntos_opcionales' => $proveedor->adjuntosOpcionales->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'tipo_adjunto' => $a->tipo_adjunto,
                        'descripcion' => optional($a->tipoAdjunto)->descripcion,
                        'nombre_archivo' => $a->nombre_archivo,
                        'ruta_archivo' => $a->ruta_archivo,
                        'url' => route('proveedores.adjuntosOpcionales.show', $a->id),
                        'size' => !empty($a->ruta_archivo) && Storage::disk('local')->exists($a->ruta_archivo)
                            ? Storage::disk('local')->size($a->ruta_archivo)
                            : null,
                    ];
                })->values(),
            ];
        });

        return Inertia::render('Compras/Proveedores/Index', [
            'proveedores' => [
                'data' => $proveedores,
            ],
            'nacionalidades' => Nacionalidad::orderBy('orden')->get([
                'id',
                'id_nac',
                'nacionalidad',
            ]),
            'condicionesIva' => CondicionIva::orderBy('id')->get([
                'id',
                'descripcion',
            ]),
            'actividades' => ActividadEconomicaProveedor::orderBy('id')->get([
                'id',
                'descripcion',
            ]),
            'entidadesFinancieras' => EntidadFinanciera::where('habilitado', 1)->orderBy('id')->get([
                'id',
                'descripcion',
                'tipo',
                'clave_unica',
                'habilitado'
            ]),
            'tiposMoneda' => TipoMoneda::where('habilitado', 1)->orderBy('id')->get([
                'id',
                'codigo',
                'descripcion',
                'simbolo',
                'pais_origen',
                'habilitado'
            ]),
            'tipoContactos' => TipoContacto::where('habilitado', 1)->orderBy('id')->get([
                'id',
                'descripcion',
                'habilitado'
            ]),
        ]);
    }

    //Form Proveedor
    public function create()
    {
        return Inertia::render('Compras/Proveedores/Crear', [
            'nacionalidades' => Nacionalidad::orderBy('orden')->get([
                'id',
                'id_nac',
                'nacionalidad',
            ]),
            'condicionesIva' => CondicionIva::orderBy('id')->get([
                'id',
                'descripcion',
            ]),
            'actividades' => ActividadEconomicaProveedor::orderBy('id')->get([
                'id',
                'descripcion',
            ]),
            'entidadesFinancieras' => EntidadFinanciera::where('habilitado', 1)->orderBy('id')->get([
                'id', 
                'descripcion', 
                'tipo', 
                'clave_unica', 
                'habilitado'
            ]),
            'tiposMoneda' => TipoMoneda::where('habilitado', 1)->orderBy('id')->get([
                'id', 
                'codigo', 
                'descripcion', 
                'simbolo', 
                'pais_origen', 
                'habilitado'
            ]),
            'tipoContactos' => TipoContacto::where('habilitado', 1)->orderBy('id')->get([
                'id',  
                'descripcion', 
                'habilitado'
            ]),
        ]);
    }

    //Crear Proveedor
    public function store(Request $request)
    {
        $validated = $request->validate($this->storeRules());

        DB::beginTransaction();

        try {
            $now = now();
            $userId = auth()->id();

            if (!empty($validated['padron_id'])) {
                $padron = Padron::findOrFail($validated['padron_id']);
            } else {
                $padron = Padron::create([
                    'tipo_documento' => $validated['tipo_documento'],
                    'documento' => $validated['documento'],
                    'nacionalidad' => empty($validated['nacionalidad']) ? null : $validated['nacionalidad'],
                    'fecha_creacion' => $now,
                    'usuario_creacion' => $userId,
                ]);
            }

            $proveedor = Proveedor::create([
                'id_padron' => $padron->id,
                'razon_social' => $validated['razon_social'],
                'nombre_fantasia' => $validated['nombre_fantasia'],
                'tipo' => $validated['tipo'],
                'fecha_creacion' => $now,
                'usuario_creacion' => $userId,
            ]);

            $this->syncCondicionIvaProveedor(
                $proveedor->id,
                $validated['condicion_iva_id'] ?? null,
                $now,
                $userId
            );

            $this->syncActividadesProveedor(
                $proveedor->id,
                $validated['actividades_ids'] ?? [],
                $now,
                $userId
            );

            $this->insertBancariosProveedor(
                $proveedor->id,
                $validated['bancarios'] ?? [],
                $now,
                $userId, 
                false
            );

            $this->insertDomiciliosProveedor(
                $proveedor->id,
                $validated['domicilios'] ?? [],
                $now,
                $userId,
                false
            );

            $this->insertContactosProveedor(
                $proveedor->id,
                $validated['contactos'] ?? [],
                $now,
                $userId,
                false
            );

            $this->syncAdjuntosRequeridosProveedor(
                $request,
                $proveedor,
                $now,
                $userId
            );

            $this->syncAdjuntosOpcionalesProveedor(
                $request,
                $proveedor,
                $now,
                $userId
            );

            DB::commit();

            return redirect()->back()->with('success', 'Proveedor creado correctamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => 'Error al crear proveedor: ' . $e->getMessage()])
                ->withInput();
        }
    }

    //Actualizar Proveedor
    public function update(Request $request, Proveedor $proveedor)
    {
        $validated = $request->validate($this->updateRules());

        DB::beginTransaction();

        try {
            $now = now();
            $userId = auth()->id();

            $padron = $proveedor->padron;

            if ($padron) {
                $padron->update([
                    'nacionalidad' => $validated['nacionalidad'] ?? $padron->nacionalidad,
                    'fecha_actualizacion' => $now,
                    'usuario_actualizacion' => $userId,
                ]);
            }

            $proveedor->update([
                'razon_social' => $validated['razon_social'],
                'nombre_fantasia' => $validated['nombre_fantasia'],
                'tipo' => $validated['tipo'],
                'fecha_actualizacion' => $now,
                'usuario_actualizacion' => $userId,
            ]);

            DB::table('padron_datos_bancarios')
                ->where('tipo', 'Proveedor')
                ->where('tipo_id', $proveedor->id)
                ->delete();

            DB::table('padron_domicilios')
                ->where('tipo', 'Proveedor')
                ->where('tipo_id', $proveedor->id)
                ->delete();

            DB::table('padron_contactos')
                ->where('tipo', 'Proveedor')
                ->where('tipo_id', $proveedor->id)
                ->delete();

            $this->syncCondicionIvaProveedor(
                $proveedor->id,
                $validated['condicion_iva_id'] ?? null,
                $now,
                $userId
            );

            $this->syncActividadesProveedor(
                $proveedor->id,
                $validated['actividades_ids'] ?? [],
                $now,
                $userId
            );

            $this->insertBancariosProveedor(
                $proveedor->id,
                $validated['bancarios'] ?? [],
                $now,
                $userId, 
                true
            );

            $this->insertDomiciliosProveedor(
                $proveedor->id,
                $validated['domicilios'] ?? [],
                $now,
                $userId, 
                true
            );

            $this->insertContactosProveedor(
                $proveedor->id,
                $validated['contactos'] ?? [],
                $now,
                $userId, 
                true
            );

            $this->syncAdjuntosRequeridosProveedor(
                $request,
                $proveedor,
                $now,
                $userId
            );

            $this->syncAdjuntosOpcionalesProveedor(
                $request,
                $proveedor,
                $now,
                $userId
            );

            DB::commit();

            return redirect()->back()->with('success', 'Proveedor actualizado');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()])
                ->withInput();
        }
    }

    //Listar CBU de Proveedor
    public function cbus($proveedorId)
    {
        $proveedor = Proveedor::findOrFail($proveedorId);

        return response()->json(
            $proveedor->datosBancarios()
                ->select('id', 'tipo_clave', 'clave', 'alias', 'predeterminado')
                ->orderByDesc('predeterminado')
                ->get()
        );
    }

    //Verifica en el Padrón por medio del documento
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
            //Caso A: NO existe en padrón
            return response()->json([
                'status' => 'not_found',
            ]);
        }

        $clienteExiste    = Cliente::where('id_padron', $padron->id)->exists();
        $proveedorExiste  = Proveedor::where('id_padron', $padron->id)->exists();

        if ($proveedorExiste) {
            //Caso D: ya existe como proveedor (no válido)
            return response()->json([
                'status'       => 'proveedor',
                'padron_id'    => $padron->id,
                'nacionalidad' => $padron->nacionalidad,
                'cliente'      => $clienteExiste,
            ]);
        }

        if ($clienteExiste) {
            //Caso C: existe como cliente, no como proveedor
            return response()->json([
                'status'       => 'cliente',
                'padron_id'    => $padron->id,
                'nacionalidad' => $padron->nacionalidad,
            ]);
        }

        //Caso B: existe solo en padrón
        return response()->json([
            'status'       => 'padron_only',
            'padron_id'    => $padron->id,
            'nacionalidad' => $padron->nacionalidad,
        ]);
    }

    //Mostrar adjuntos requeridos
    public function showAdjunto(PadronAdjuntoRequerido $adjunto)
    {
        if (!Storage::disk('local')->exists($adjunto->ruta_archivo)) {
            abort(404, 'Archivo no encontrado.');
        }

        return Storage::disk('local')->response(
            $adjunto->ruta_archivo,
            $adjunto->nombre_archivo
        );
    }

    //Mostrar adjuntos opcionales
    public function showAdjuntoOpcional(PadronAdjuntoOpcional $adjunto)
    {
        if (!Storage::disk('local')->exists($adjunto->ruta_archivo)) {
            abort(404, 'Archivo no encontrado.');
        }

        return Storage::disk('local')->response(
            $adjunto->ruta_archivo,
            $adjunto->nombre_archivo
        );
    }

    private function storeRules(): array
    {
        return [
            'tipo_documento'   => 'required|string',
            'documento'        => ['required', 'regex:/^[0-9]+$/', 'max:20'],
            'nacionalidad'     => 'nullable|integer|exists:nacionalidades,id',
            'razon_social'     => 'required|string|max:100',
            'nombre_fantasia'  => 'required|string|max:100',
            'tipo'             => ['required', Rule::in(['Humana', 'Jurídica'])],
            'padron_id'        => 'nullable|integer|exists:padron,id',

            'condicion_iva_id' => 'required|integer|exists:condicion_iva,id',
            'actividades_ids' => 'required|array|min:1',
            'actividades_ids.*' => 'integer|exists:actividades_economicas_proveedores,id',

            'bancarios' => 'required|array|min:1',
            'bancarios.*.entidad_financiera_id' => 'nullable|integer|exists:entidades_financieras,id',
            'bancarios.*.tipo_clave' => ['nullable', Rule::in(['Cbu', 'Cvu', ''])],
            'bancarios.*.clave' => 'nullable|string|max:22',
            'bancarios.*.alias' => 'nullable|string|max:255',
            'bancarios.*.moneda_id' => 'nullable|integer|exists:tipo_monedas,id',
            'bancarios.*.tipo_cuenta' => ['nullable', Rule::in(['Caja de Ahorro', 'Cuenta Corriente', ''])],
            'bancarios.*.predeterminado' => 'sometimes|boolean',

            'domicilios' => 'array',
            'domicilios.*.tipo_domicilio' => ['required_with:domicilios', Rule::in(['Real', 'Fiscal'])],
            'domicilios.*.calle_id' => 'required_with:domicilios|string|max:64',
            'domicilios.*.altura' => 'required_with:domicilios|integer|min:1|max:999999',
            'domicilios.*.codigo_postal' => 'nullable|string|max:20',
            'domicilios.*.piso' => 'nullable|string|max:10',
            'domicilios.*.departamento' => 'nullable|string|max:20',
            'domicilios.*.observaciones' => 'nullable|string|max:1000',
            'domicilios.*.predeterminado' => 'sometimes|boolean',

            'contactos' => 'array',
            'contactos.*.tipo_contacto' => 'required_with:contactos|integer|exists:tipo_contactos,id',
            'contactos.*.contacto' => 'required_with:contactos|string|max:150',
            'contactos.*.predeterminado' => 'sometimes|boolean',

            'documentacion.constancia_inscripcion' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
            'documentacion.constancia_inscripcion_fecha_adjunto' => 'required|date',
            'documentacion.constancias_cbu' => 'array',
            'documentacion.constancias_cbu.*' => 'file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
            'documentacion.exenciones' => 'array',
            'documentacion.exenciones.*' => 'file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
        ];
    }

    private function updateRules(): array
    {
        return [
            'tipo_documento'   => 'required|string',
            'documento'        => ['required', 'regex:/^[0-9]+$/', 'max:20'],
            'nacionalidad'     => 'nullable|integer|exists:nacionalidades,id',
            'razon_social'     => 'required|string|max:100',
            'nombre_fantasia'  => 'required|string|max:100',
            'tipo'             => ['required', Rule::in(['Humana', 'Jurídica'])],
            'padron_id'        => 'nullable|integer|exists:padron,id',

            'condicion_iva_id' => 'required|integer|exists:condicion_iva,id',
            'actividades_ids' => 'required|array|min:1',
            'actividades_ids.*' => 'integer|exists:actividades_economicas_proveedores,id',

            'bancarios' => 'required|array|min:1',
            'bancarios.*.entidad_financiera_id' => 'nullable|integer|exists:entidades_financieras,id',
            'bancarios.*.tipo_clave' => ['nullable', Rule::in(['Cbu', 'Cvu', ''])],
            'bancarios.*.clave' => 'nullable|string|max:22',
            'bancarios.*.alias' => 'nullable|string|max:255',
            'bancarios.*.moneda_id' => 'nullable|integer|exists:tipo_monedas,id',
            'bancarios.*.tipo_cuenta' => ['nullable', Rule::in(['Caja de Ahorro', 'Cuenta Corriente', ''])],
            'bancarios.*.predeterminado' => 'sometimes|boolean',

            'domicilios' => 'array',
            'domicilios.*.tipo_domicilio' => ['required_with:domicilios', Rule::in(['Real', 'Fiscal'])],
            'domicilios.*.calle_id' => 'required_with:domicilios|string|max:64',
            'domicilios.*.altura' => 'required_with:domicilios|integer|min:1|max:999999',
            'domicilios.*.codigo_postal' => 'nullable|string|max:20',
            'domicilios.*.piso' => 'nullable|string|max:10',
            'domicilios.*.departamento' => 'nullable|string|max:20',
            'domicilios.*.observaciones' => 'nullable|string|max:1000',
            'domicilios.*.predeterminado' => 'sometimes|boolean',

            'contactos' => 'array',
            'contactos.*.tipo_contacto' => 'required_with:contactos|integer|exists:tipo_contactos,id',
            'contactos.*.contacto' => 'required_with:contactos|string|max:150',
            'contactos.*.predeterminado' => 'sometimes|boolean',

            'documentacion.constancia_inscripcion' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
            'documentacion.constancia_inscripcion_fecha_adjunto' => 'required|date',
            'documentacion.constancias_cbu' => 'array',
            'documentacion.constancias_cbu.*' => 'file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
            'documentacion.exenciones' => 'array',
            'documentacion.exenciones.*' => 'file|mimes:pdf,jpg,jpeg,png,webp|max:2048',
            'documentacion_existente.constancia_inscripcion.id' => 'nullable|integer|exists:padron_adjuntos_requeridos,id',
            'documentacion_existente.constancias_cbu' => 'array',
            'documentacion_existente.constancias_cbu.*.id' => 'integer|exists:padron_adjuntos_opcionales,id',
            'documentacion_existente.exenciones' => 'array',
            'documentacion_existente.exenciones.*.id' => 'integer|exists:padron_adjuntos_opcionales,id',
        ];
    }

    //Inserta en Entidades Financiadas(Bancos)
    private function insertBancariosProveedor(int $proveedorId, array $bancarios, $now, int $userId, bool $isUpdate): void
    {
        if (!is_array($bancarios) || count($bancarios) === 0) {
            return;
        }

        $seen = [];
        $clean = [];

        foreach ($bancarios as $b) {
            $entidadId = !empty($b['entidad_financiera_id']) ? (int) $b['entidad_financiera_id'] : null;
            $tipoClave = isset($b['tipo_clave']) && trim((string) $b['tipo_clave']) !== '' ? trim((string) $b['tipo_clave']) : 'Undefined';
            $clave = isset($b['clave']) && trim((string) $b['clave']) !== '' ? trim((string) $b['clave']) : null;
            $alias = isset($b['alias']) && trim((string) $b['alias']) !== '' ? trim((string) $b['alias']) : null;
            $monedaId = !empty($b['moneda_id']) ? (int) $b['moneda_id'] : null;
            $tipoCuenta = isset($b['tipo_cuenta']) && trim((string) $b['tipo_cuenta']) !== '' ? trim((string) $b['tipo_cuenta']) : 'Undefined';

            //Si no tiene entidad o moneda o tipo_cuenta, no se inserta
            if (!$entidadId || !$monedaId || $tipoCuenta === 'Undefined') {
                continue;
            }

            //Al menos clave o alias
            if ($clave === null && $alias === null) {
                continue;
            }

            $k = "Proveedor|{$proveedorId}|{$entidadId}|{$tipoClave}|{$clave}|{$alias}|{$monedaId}|{$tipoCuenta}";
            if (isset($seen[$k])) {
                continue;
            }
            $seen[$k] = true;

            $row = [
                'tipo' => 'Proveedor',
                'tipo_id' => $proveedorId,
                'tipo_clave' => $tipoClave,
                'clave' => $clave,
                'alias' => $alias,
                'entidad_financiera' => $entidadId,
                'moneda' => $monedaId,
                'tipo_cuenta' => $tipoCuenta,
                'predeterminado' => !empty($b['predeterminado']),
                'fecha_creacion' => $now,
                'usuario_creacion' => $userId,
            ];
            
            if ($isUpdate) {
                $row['fecha_actualizacion'] = $now;
                $row['usuario_actualizacion'] = $userId;
            }
            
            $clean[] = $row;
        }

        if (count($clean) === 0) {
            return;
        }

        $hasDefault = collect($clean)->contains(fn ($x) => (bool) $x['predeterminado']);

        if ($hasDefault) {
            $found = false;
            foreach ($clean as $i => $row) {
                if ($row['predeterminado'] && !$found) {
                    $found = true;
                    continue;
                }
                if ($row['predeterminado'] && $found) {
                    $clean[$i]['predeterminado'] = false;
                }
            }
        }

        DB::table('padron_datos_bancarios')->insert($clean);
    }

    //Inserta en Padrón Domicilios
    private function insertDomiciliosProveedor(int $proveedorId, array $domicilios, $now, int $userId, bool $isUpdate): void
    {
        if (!is_array($domicilios) || count($domicilios) === 0) {
            return;
        }

        $seen = [];
        $clean = [];

        foreach ($domicilios as $d) {
            $tipoDom = $d['tipo_domicilio'];
            $calleId = (string) $d['calle_id'];
            $altura  = (int) $d['altura'];

            $k = "Proveedor|{$proveedorId}|{$tipoDom}|{$calleId}|{$altura}";
            if (isset($seen[$k])) {
                continue;
            }
            $seen[$k] = true;

            $row = [
                'tipo' => 'Proveedor',
                'tipo_id' => $proveedorId,
                'tipo_domicilio' => $tipoDom,
                'calle_id' => $calleId,
                'altura' => $altura,
                'codigo_postal' => isset($d['codigo_postal']) && trim((string) $d['codigo_postal']) !== '' ? trim((string) $d['codigo_postal']) : null,
                'piso' => isset($d['piso']) && trim((string) $d['piso']) !== '' ? trim((string) $d['piso']) : null,
                'departamento' => isset($d['departamento']) && trim((string) $d['departamento']) !== '' ? trim((string) $d['departamento']) : null,
                'observaciones' => isset($d['observaciones']) && trim((string) $d['observaciones']) !== '' ? trim((string) $d['observaciones']) : null,
                'predeterminado' => !empty($d['predeterminado']),
                'fecha_creacion' => $now,
                'usuario_creacion' => $userId,
            ];

            if ($isUpdate) {
                $row['fecha_actualizacion'] = $now;
                $row['usuario_actualizacion'] = $userId;
            }
            
            $clean[] = $row;
        }

        if (count($clean) === 0) {
            return;
        }

        $hasDefault = collect($clean)->contains(fn ($x) => (bool) $x['predeterminado']);

        if ($hasDefault) {
            $found = false;
            foreach ($clean as $i => $row) {
                if ($row['predeterminado'] && !$found) {
                    $found = true;
                    continue;
                }
                if ($row['predeterminado'] && $found) {
                    $clean[$i]['predeterminado'] = false;
                }
            }
        }

        DB::table('padron_domicilios')->insert($clean);
    }

    //Inserta en Padrón Contactos
    private function insertContactosProveedor(int $proveedorId, array $contactos, $now, int $userId, bool $isUpdate): void
    {
        if (!is_array($contactos) || count($contactos) === 0) {
            return;
        }

        $seen = [];
        $clean = [];

        foreach ($contactos as $c) {
            $tipoContactoId = (int) $c['tipo_contacto'];
            $valor = trim((string) $c['contacto']);

            if ($tipoContactoId <= 0 || $valor === '') {
                continue;
            }

            $k = "Proveedor|{$proveedorId}|{$tipoContactoId}|{$valor}";
            if (isset($seen[$k])) {
                continue;
            }
            $seen[$k] = true;

            $row = [
                'tipo' => 'Proveedor',
                'tipo_id' => $proveedorId,
                'tipo_contacto' => $tipoContactoId,
                'contacto' => $valor,
                'predeterminado' => !empty($c['predeterminado']),
                'fecha_creacion' => $now,
                'usuario_creacion' => $userId,
            ];

            if ($isUpdate) {
                $row['fecha_actualizacion'] = $now;
                $row['usuario_actualizacion'] = $userId;
            }
            
            $clean[] = $row;
        }

        if (count($clean) === 0) {
            return;
        }

        $hasDefault = collect($clean)->contains(fn ($x) => (bool) $x['predeterminado']);

        if ($hasDefault) {
            $found = false;
            foreach ($clean as $i => $row) {
                if ($row['predeterminado'] && !$found) {
                    $found = true;
                    continue;
                }
                if ($row['predeterminado'] && $found) {
                    $clean[$i]['predeterminado'] = false;
                }
            }
        }

        DB::table('padron_contactos')->insert($clean);
    }

    private function syncActividadesProveedor(int $proveedorId, array $actividadesIds, $now, int $userId): void
    {
        DB::table('relacion_proveedor_actividad')
            ->where('id_proveedor', $proveedorId)
            ->delete();

        $ids = collect($actividadesIds ?? [])
            ->filter(fn ($id) => !empty($id))
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return;
        }

        $rows = $ids->map(fn ($id) => [
            'id_actividad' => $id,
            'id_proveedor' => $proveedorId,
            'fecha_creacion' => $now,
            'usuario_creacion' => $userId,
        ])->all();

        DB::table('relacion_proveedor_actividad')->insert($rows);
    }

    private function syncCondicionIvaProveedor(int $proveedorId, ?int $condicionIvaId, $now, int $userId): void
    {
        DB::table('relacion_proveedor_condicion')
            ->where('id_proveedor', $proveedorId)
            ->delete();

        if (empty($condicionIvaId)) {
            return;
        }

        DB::table('relacion_proveedor_condicion')->insert([
            'id_iva' => (int) $condicionIvaId,
            'id_proveedor' => $proveedorId,
            'fecha_creacion' => $now,
            'usuario_creacion' => $userId,
        ]);
    }

    private function syncAdjuntosRequeridosProveedor(Request $request, Proveedor $proveedor, $now, int $userId): void
    {
        $documento = preg_replace('/\D+/', '', (string) optional($proveedor->padron)->documento);
        $basePath = "documentacion/proveedores/{$documento}";

        $adjuntoExistente = DB::table('padron_adjuntos_requeridos')
            ->where('tipo', 'Proveedor')
            ->where('tipo_id', $proveedor->id)
            ->where('tipo_adjunto', 1)
            ->first();

        $constanciaExistenteId = data_get($request->all(), 'documentacion_existente.constancia_inscripcion.id');
        $tieneNuevaConstancia = $request->hasFile('documentacion.constancia_inscripcion');

        //Si el usuario quitó la constancia existente y no subió una nueva, da error
        if (empty($constanciaExistenteId) && !$tieneNuevaConstancia) {
            throw new \Exception('La constancia de inscripción es obligatoria.');
        }

        //Si existe una constancia en BD pero el usuario la quitó y no la va a reutilizar,
        //se elimina el archivo y el registro
        if (
            $adjuntoExistente &&
            empty($constanciaExistenteId) &&
            !$tieneNuevaConstancia
        ) {
            if (!empty($adjuntoExistente->ruta_archivo) && Storage::disk('local')->exists($adjuntoExistente->ruta_archivo)) {
                Storage::disk('local')->delete($adjuntoExistente->ruta_archivo);
            }

            DB::table('padron_adjuntos_requeridos')
                ->where('id', $adjuntoExistente->id)
                ->delete();
        }

        //Si vino una nueva constancia, se actualiza la existente si ya hay una,
        //o se inserta si todavía no existía
        if ($tieneNuevaConstancia) {
            $file = $request->file('documentacion.constancia_inscripcion');
            $storedPath = $file->store("{$basePath}/constancia_inscripcion");
            $fechaAdjunto = data_get($request->all(), 'documentacion.constancia_inscripcion_fecha_adjunto');

            if ($adjuntoExistente) {
                //Borrar archivo anterior
                if (!empty($adjuntoExistente->ruta_archivo) && Storage::disk('local')->exists($adjuntoExistente->ruta_archivo)) {
                    Storage::disk('local')->delete($adjuntoExistente->ruta_archivo);
                }

                DB::table('padron_adjuntos_requeridos')
                    ->where('id', $adjuntoExistente->id)
                    ->update([
                        'nombre_archivo' => $file->getClientOriginalName(),
                        'ruta_archivo' => $storedPath,
                        'fecha_adjunto' => $fechaAdjunto,
                        'fecha_modificacion' => $now,
                        'usuario_modificacion' => $userId,
                    ]);
            } else {
                DB::table('padron_adjuntos_requeridos')->insert([
                    'tipo' => 'Proveedor',
                    'tipo_id' => $proveedor->id,
                    'tipo_adjunto' => 1,
                    'nombre_archivo' => $file->getClientOriginalName(),
                    'ruta_archivo' => $storedPath,
                    'fecha_adjunto' => $fechaAdjunto,
                    'fecha_carga' => $now,
                    'usuario_carga' => $userId,
                    'fecha_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $now : null,
                    'usuario_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $userId : null,
                ]);
            }

            return;
        }

        //Si no vino archivo nuevo pero sí se mantiene la constancia existente,
        //solo se actualiza fecha_adjunto si hace falta
        if ($adjuntoExistente && !empty($constanciaExistenteId)) {
            DB::table('padron_adjuntos_requeridos')
                ->where('id', $adjuntoExistente->id)
                ->update([
                    'fecha_adjunto' => data_get($request->all(), 'documentacion.constancia_inscripcion_fecha_adjunto'),
                    'fecha_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $now : $adjuntoExistente->fecha_modificacion,
                    'usuario_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $userId : $adjuntoExistente->usuario_modificacion,
                ]);
        }
    }

    private function syncAdjuntosOpcionalesProveedor(Request $request, Proveedor $proveedor, $now, int $userId): void
    {
        $documento = preg_replace('/\D+/', '', (string) optional($proveedor->padron)->documento);
        $basePath = "documentacion/proveedores/{$documento}";

        $existentes = DB::table('padron_adjuntos_opcionales')
            ->where('tipo', 'Proveedor')
            ->where('tipo_id', $proveedor->id)
            ->get()
            ->keyBy('id');

        $idsMantener = collect();

        foreach (data_get($request->all(), 'documentacion_existente.constancias_cbu', []) as $item) {
            if (!empty($item['id'])) {
                $idsMantener->push((int) $item['id']);
            }
        }

        foreach (data_get($request->all(), 'documentacion_existente.exenciones', []) as $item) {
            if (!empty($item['id'])) {
                $idsMantener->push((int) $item['id']);
            }
        }

        $idsMantener = $idsMantener->unique()->values();

        $idsEliminar = $existentes->keys()->diff($idsMantener);

        foreach ($idsEliminar as $idEliminar) {
            $adjunto = $existentes->get($idEliminar);

            if ($adjunto && !empty($adjunto->ruta_archivo) && Storage::disk('local')->exists($adjunto->ruta_archivo)) {
                Storage::disk('local')->delete($adjunto->ruta_archivo);
            }

            DB::table('padron_adjuntos_opcionales')
                ->where('id', $idEliminar)
                ->delete();
        }

        if ($request->hasFile('documentacion.constancias_cbu')) {
            foreach ($request->file('documentacion.constancias_cbu') as $file) {
                $storedPath = $file->store("{$basePath}/constancias_cbu");

                DB::table('padron_adjuntos_opcionales')->insert([
                    'tipo' => 'Proveedor',
                    'tipo_id' => $proveedor->id,
                    'tipo_adjunto' => 2,
                    'nombre_archivo' => $file->getClientOriginalName(),
                    'ruta_archivo' => $storedPath,
                    'fecha_carga' => $now,
                    'usuario_carga' => $userId,
                    'fecha_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $now : null,
                    'usuario_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $userId : null,
                ]);
            }
        }

        if ($request->hasFile('documentacion.exenciones')) {
            foreach ($request->file('documentacion.exenciones') as $file) {
                $storedPath = $file->store("{$basePath}/exenciones");

                DB::table('padron_adjuntos_opcionales')->insert([
                    'tipo' => 'Proveedor',
                    'tipo_id' => $proveedor->id,
                    'tipo_adjunto' => 3,
                    'nombre_archivo' => $file->getClientOriginalName(),
                    'ruta_archivo' => $storedPath,
                    'fecha_carga' => $now,
                    'usuario_carga' => $userId,
                    'fecha_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $now : null,
                    'usuario_modificacion' => $request->isMethod('put') || $request->isMethod('patch') ? $userId : null,
                ]);
            }
        }
    }
}
