<?php

namespace App\Http\Controllers\Compras\ComprobantesProveedores;
use App\Http\Controllers\Controller;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenCompra;
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


    ////CREAR COMPROBANTE PROVEEDOR
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // ✅ Validar datos básicos
            $request->validate([
                'proveedor_id' => 'required|exists:proveedores,id',
                'punto_venta' => 'required|string|max:10',
                'numero_factura' => 'required|string|max:20',
                'tipo_comprobante_id' => 'required|exists:tipo_comprobantes,id',
                'detalles' => 'required|array|min:1',
            ]);

            // 🚫 Verificar duplicado: mismo proveedor + punto venta + nro factura + tipo comprobante
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

            // 1️⃣ Crear el comprobante principal
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

            // 2️⃣ Crear los detalles
            foreach ($request->detalles as $detalle) {
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

                if (!empty($detalle['impuestos'])) {
                    foreach ($detalle['impuestos'] as $impuestoId) {
                        DB::table('comprobantes_proveedores_detalles_impuestos')->insert([
                            'detalle_id' => $detalleComprobante->id,
                            'impuesto_id' => $impuestoId,
                        ]);
                    }
                }
            }

            // 3️⃣ Asociar con las órdenes de compra
            $ordenes = array_filter(array_unique($request->orden_compra_id ?? []));
            if (!empty($ordenes)) {
                $comprobante->ordenesCompra()->syncWithoutDetaching($ordenes);
            }

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
