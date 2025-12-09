<?php

namespace App\Http\Controllers\Compras\ComprobantesProveedores;
use App\Http\Controllers\Controller;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenCompra;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\General\Impuesto;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComprobantesProveedoresController extends Controller
{
    ////LISTAR COMPROBANTES PROVEEDORES PENDIENTES
    public function index()
    {
        $comprobantesProveedorListado = ComprobanteProveedor::with(
            [
                'detalles',
                'detalles.producto',
                'detalles.producto.modelo',
                'detalles.producto.modelo.marca',
                'detalles.producto.subcategoria',
                'detalles.cuentaContable',
                'condicionVenta',
                'proveedor',
                'tipoComprobante',
            ])
            ->where('estado', 'Pendiente')   // 👈 solo pendientes
            ->get();



        return Inertia::render('Compras/ComprobantesProveedores/Index', [
            'comprobantesProveedorListado' => $comprobantesProveedorListado,
        ]);

    }


    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // ---------------- VALIDACIÓN ----------------
            $request->validate([
                'proveedor_id' => 'required|exists:proveedores,id',
                'punto_venta' => 'required|string|max:10',
                'numero_factura' => 'required|string|max:20',
                'tipo_comprobante_id' => 'required|exists:tipo_comprobantes,id',
                'detalles' => 'required|array|min:1',
                'totalOrden' => 'required|numeric|min:0',
            ]);

            // ---------------- DUPLICADOS ----------------
            $existe = ComprobanteProveedor::where('proveedor_id', $request->proveedor_id)
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
            $comprobante = ComprobanteProveedor::create([
                'proveedor_id' => $request->proveedor_id,
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
                $comprobante->ordenesCompra()->syncWithoutDetaching($ordenes);
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


            // ---------------- PARTIDA DE PROVEEDOR (HABER) ----------------
            $proveedor = Proveedor::find($request->proveedor_id);

            Partida::create([
                'co_asiento_id' => $asiento->id,
                'co_cuenta_id' => '222',
                'concepto' => "Proveedor {$proveedor->nombre}",
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
        // Trae la orden de compra con sus comprobantes relacionados
        $orden = OrdenCompra::with([
            'comprobantesProveedores.detalles' => function ($q) {
                $q->select('id', 'comprobante_proveedor_id', 'producto_id', 'cantidad');
            },
            'comprobantesProveedores.detalles.producto:id,nombre,modelo_id',
        ])->find($ordenId);

        if (!$orden) {
            return response()->json(['error' => 'Orden no encontrada'], 404);
        }

        // Devolver solo los comprobantes relacionados
        $comprobantes = $orden->comprobantesProveedores;

        return response()->json($comprobantes);
    }

}
