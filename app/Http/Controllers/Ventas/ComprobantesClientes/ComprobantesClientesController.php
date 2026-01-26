<?php

namespace App\Http\Controllers\Ventas\ComprobantesClientes;
use App\Http\Controllers\Controller;
use App\Models\Contabilidad\Comprobante;
use App\Models\Ventas\OrdenVenta;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\General\Impuesto;
use App\Models\General\TipoComprobante;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComprobantesClientesController extends Controller
{
    ////LISTAR COMPROBANTES CLIENTES PENDIENTES
    public function index()
    {
        $comprobantesClienteListado = Comprobante::with(
            [
                'detalles',
                'detalles.producto',
                'detalles.producto.modelo',
                'detalles.producto.modelo.marca',
                'detalles.producto.subcategoria',
                'detalles.cuentaContable',
                'condicionVenta',
                'cliente',
                'tipoComprobante',
            ])
            ->where('estado', 'Pendiente')   // 👈 solo pendientes
            ->get();



        return Inertia::render('Contabilidad/ComprobantesClientes/Index', [
            'comprobantesClienteListado' => $comprobantesClienteListado,
        ]);

    }


    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // ---------------- VALIDACIÓN ----------------
            $request->validate([
                'tipo_id' => 'required|exists:clientes,id',
                'condicion_venta_id' => 'required|exists:condiciones_venta,id',
                'punto_venta' => 'required|string|max:10',
                'numero_factura' => 'required|string|max:20',
                'tipo_comprobante_id' => 'required|exists:tipo_comprobantes,id',
                'detalles' => 'required|array|min:1',
                'totalOrden' => 'required|numeric|min:0',
            ]);

            // ---------------- DUPLICADOS ----------------
            $existe = Comprobante::where('tipo_id', $request->cliente_id)
                ->where('punto_venta', $request->punto_venta)
                ->where('numero_factura', $request->numero_factura)
                ->where('tipo_comprobante_id', $request->tipo_comprobante_id)
                ->exists();

            if ($existe) {
                return response()->json([
                    'error' => 'Ya existe un comprobante con ese tipo, punto de venta y número de factura para este proveedor.'
                ], 422);
            }

            // ---------------- CREAR COMPROBANTE ----------------
            $comprobante = Comprobante::create([
                'tipo_id' => $request->cliente_id,
                'fecha_factura' => $request->fecha_factura,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'condicion_venta_id' => $request->condicion_venta_id,
                'punto_venta' => $request->punto_venta,
                'numero_factura' => $request->numero_factura,
                'tipo_comprobante_id' => $request->tipo_comprobante_id,
                'estado' => $request->estado,
                'descripcion' => $request->descripcion,
                'usuario_creacion' => $request->usuario_creacion,
            ]);

            // ---------------- PREPARAR ACUMULADORES ----------------
            $gastosAgrupados = [];  // cuenta contable => importe
            $impuestosAgrupados = []; // cuenta contable impuesto => importe
            $totalFactura = 0;

            // --------------------------------------------------------
            // 1️⃣ RECORRER DETALLES
            // --------------------------------------------------------
            foreach ($request->detalles as $detalle) {

                // Crear detalle del comprobante
                $detalleComprobante = $comprobante->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'descripcion' => $detalle['descripcion'],
                    'modelo' => $detalle['modelo'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'porcentaje_descuento' => $detalle['porcentaje_descuento'],
                    'co_cuenta_id' => $detalle['co_cuenta_id'],
                    'importe' => $detalle['importe'],
                    'usuario_creacion' => $detalle['usuario_creacion'],
                ]);

                // Acumular gasto por cuenta
                if (!isset($gastosAgrupados[$detalle['co_cuenta_id']])) {
                    $gastosAgrupados[$detalle['co_cuenta_id']] = 0;
                }

                $gastosAgrupados[$detalle['co_cuenta_id']] += $detalle['importe'];
                $totalFactura += $detalle['importe'];

                // ---------------- IMPUESTOS DEL DETALLE ----------------
                if (!empty($detalle['impuestos'])) {

                    foreach ($detalle['impuestos'] as $impuestoId) {

                        $imp = Impuesto::find($impuestoId);

                        if (!$imp) continue;

                        // Validación clave
                        if (empty($imp->co_cuenta_id)) {
                            throw new \Exception("El impuesto '{$imp->descripcion}' no tiene una cuenta contable asignada.");
                        }

                        // Calcular importe del impuesto
                        $importeImpuesto = ($detalle['importe'] * $imp->porcentaje) / 100;

                        // Guardar pivote
                        DB::table('comprobantes_proveedores_detalles_impuestos')->insert([
                            'detalle_id' => $detalleComprobante->id,
                            'impuesto_id' => $imp->id
                        ]);

                        // Acumular impuesto por su cuenta contable
                       if (!isset($impuestosAgrupados[$imp->co_cuenta_id]) || !is_array($impuestosAgrupados[$imp->co_cuenta_id])) {
                            $impuestosAgrupados[$imp->co_cuenta_id] = [
                                'nombre' => $imp->descripcion,
                                'importe' => 0
                            ];
                        }

                        $impuestosAgrupados[$imp->co_cuenta_id]['importe'] += $importeImpuesto;
                        $totalFactura += $importeImpuesto;
                    }
                }
            }

            // --------------------------------------------------------
            // 2️⃣ ASOCIAR ORDENES DE COMPRA (si corresponde)
            // --------------------------------------------------------
            $ordenes = array_filter(array_unique($request->orden_compra_id ?? []));
            if (!empty($ordenes)) {
                $comprobante->ordenesVenta()->syncWithoutDetaching($ordenes);
            }

            // --------------------------------------------------------
            // 3️⃣ GENERAR ASIENTO CONTABLE
            // --------------------------------------------------------
            $ejercicio = Ejercicio::where('estado', 'ABIERTO')->firstOrFail();

            $asiento = Asiento::create([
                'numero' => Asiento::max('numero') + 1,
                'co_ejercicio_id' => $ejercicio->id,
                'fecha' => $request->fecha_factura,
                'concepto' => "Comprobante proveedor N° {$comprobante->id}",
                'estado' => 'Pendiente',
                'importe' => $totalFactura,
                'model_id_created' => $request->usuario_creacion,
                'created_at' => now(),
            ]);

            // ---------------- PARTIDAS DE GASTOS ----------------
            foreach ($gastosAgrupados as $cuentaId => $importe) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Gasto comprobante proveedor",
                    'debe' => $importe,
                    'haber' => 0,
                ]);
            }

            // ---------------- PARTIDAS DE IMPUESTOS ----------------
            foreach ($impuestosAgrupados as $cuentaId => $data) {
                Partida::create([
                    'co_asiento_id' => $asiento->id,
                    'co_cuenta_id' => $cuentaId,
                    'concepto' => "Impuesto: {$data['nombre']}",
                    'debe' => $data['importe'],
                    'haber' => 0,
                ]);
            }


            // ---------------- PARTIDA DE CLIENTE (HABER) ----------------
            $cliente = Cliente::find($request->cliente_id);

            Partida::create([
                'co_asiento_id' => $asiento->id,
                'co_cuenta_id' => '222',
                'concepto' => "Cliente {$cliente->nombre}",
                'debe' => 0,
                'haber' => $totalFactura,
            ]);

            // --------------------------------------------------------
            DB::commit();

            return response()->json($comprobante->load('detalles.impuestos'), 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json(['errors' => $e->errors()], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }





    ///OBTENER COMPROBANTES PROVEEDORES POR ORDEN DE COMPRA
    public function comprobantesPorOrden($ordenId)
    {
        // Trae la orden de venta con sus comprobantes relacionados
        $orden = OrdenVenta::with([
            'comprobantes.detalles' => function ($q) {
                $q->select('id', 'comprobante_id', 'producto_id', 'cantidad');
            },
            'comprobantes.detalles.producto:id,nombre,modelo_id',
        ])->find($ordenId);

        if (!$orden) {
            return response()->json(['error' => 'Orden no encontrada'], 404);
        }

        // Devolver solo los comprobantes relacionados
        $comprobantes = $orden->comprobantes;

        return response()->json($comprobantes);
    }

    public function getProximoNumeroAnticipo()
    {
        // El punto de venta fijo para los Anticipos, como se definió en el frontend
        $puntoVentaAnticipo = '0001';

        // 1. Encontrar el ID del tipo de comprobante 'Anticipo'
        $tipoAnticipo = TipoComprobante::where('nombre', 'Anticipo')->first();

        if (!$tipoAnticipo) {
            // Si el tipo no existe, retornamos un error o forzamos el inicio en 1
            // Retornar 1 es una solución más suave para el UX
            return response()->json(['proximo_numero' => 1]);
        }

        $tipoComprobanteId = $tipoAnticipo->id;

        // 2. Encontrar el último comprobante existente
        $ultimoComprobante = Comprobante::where('tipo_comprobante_id', $tipoComprobanteId)
            ->where('punto_venta', $puntoVentaAnticipo)
            // Importante: Ordenar por el número como si fuera un entero (SIGNED) para obtener el máximo correcto.
            ->orderByRaw('CAST(numero_factura AS SIGNED) DESC')
            ->first();

        $proximoNumero = 1;

        if ($ultimoComprobante) {
            // Convertir a entero, sumar 1
            $ultimoNumero = (int) $ultimoComprobante->numero_factura;
            $proximoNumero = $ultimoNumero + 1;
        }

        // 3. Devolver el número
        // El frontend se encargará de darle el formato con ceros a la izquierda (padding).
        return response()->json([
            'proximo_numero' => $proximoNumero
        ]);
    }

    public function anticiposDisponibles($clienteId)
    {
        $anticipos = Comprobante::with([
            'detalles',
            'comprobantesAplicados'
        ])
        ->where('tipo_id', $clienteId)
        ->whereHas('tipoComprobante', function ($q) {
            $q->where('categoria', 'anticipo');
        })
        ->get()
        ->map(function ($anticipo) {

            // 🔹 Total real del anticipo
            $importeAnticipo = $anticipo->detalles->sum(function ($d) {
                return (float) $d->importe;
            });

            // 🔹 Si no tiene importe, no es usable
            if ($importeAnticipo <= 0) {
                return null;
            }

            // 🔹 Total aplicado (si no hay relaciones → 0)
            $importeAplicado = $anticipo->comprobantesAplicados->sum(function ($comp) {
                return (float) ($comp->pivot->importe_aplicado ?? 0);
            });

            // 🔹 Disponible
            $importeDisponible = $importeAnticipo - $importeAplicado;

            // 🔹 Si ya se consumió completamente
            if ($importeDisponible <= 0) {
                return null;
            }

            // 🔹 Datos para el frontend
            $anticipo->importe_total = $importeAnticipo;
            $anticipo->importe_aplicado = $importeAplicado;
            $anticipo->importe_disponible = $importeDisponible;

            return $anticipo;
        })
        ->filter()
        ->values();

        return response()->json($anticipos);
    }



}
