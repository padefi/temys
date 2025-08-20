<?php

namespace App\Http\Controllers\Compras\OrdenCompras;
use App\Http\Controllers\Controller;
use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCompra;
use App\Models\Compras\OrdenCompraDetalle;
use App\Models\General\Impuesto;
use App\Models\General\TipoMoneda;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;



class OrdenComprasController extends Controller
{
    public function index()
    {

        $ordenesComprasListado = OrdenCompra::with(
            [
                'detalles',
                'detalles.producto',
                'detalles.producto.modelo',
                'detalles.producto.modelo.marca',
                'detalles.producto.subcategoria',
                'ordenesCotizacion',
                'proveedor',
                'ordenesCotizacion.tipoMoneda',
                'ordenesCotizacion.ordenesCompra'
            ])->get();



        return Inertia::render('Compras/ComprasOrdenes/Index', [
            'ordenesComprasListado' => $ordenesComprasListado,
        ]);

    }

    public function nuevaOrdenCompra()
    {
        return Inertia::render('Compras/ComprasOrdenes/NuevaOrdenCompra/Index', [
            'proveedores' => [
            'data' => Proveedor::with('padron')->get() // Estructura que espera el frontend
            ],
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
            'impuestos' => Impuesto::all(),
            'almacenDestino' => Almacen::all(),
            //'module' => '3',

        ]);
    }

    ////////////Confirmar Orden de Compra
    public function confirmarOrdenCompra(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'ordenCompra' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|string',
            'entrega_esperada' => 'required|date',
            'almacen' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.entrega_esperada' => 'required|date',
            'productos.*.descripcion' => 'required|string',
            'productos.*.codigo_barras' => 'nullable|string',
            'productos.*.referencia' => 'nullable|string',
            'productos.*.cantidad' => 'required|numeric|min:1',
            'productos.*.precio_unitario' => 'nullable|numeric',
            'productos.*.porcentaje_descuento' => 'nullable|numeric',
            'productos.*.importe' => 'nullable|numeric',
        ]);

        $proveedor = Proveedor::where('nombre_fantasia', $validated['proveedor'])->firstOrFail();

        DB::beginTransaction();

        try {

            // 🔵 1) Orden Compra
            if (!empty($validated['ordenCompra'])) {
                $orden = OrdenCompra::findOrFail($validated['ordenCompra']);
                $orden->update([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'almacen_destino_id' => $validated['almacen'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'estado' => 'Confirmada',
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);

            } else {
                $orden = OrdenCompra::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'almacen_destino_id' => $validated['almacen'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'estado' => 'Confirmada',
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_creacion' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                ]);
            }


            // 🔵 2) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                $detalle = OrdenCompraDetalle::updateOrCreate(
                    [
                        // 🔑 Claves para identificar si ya existe
                        'orden_compras_id'   => $orden->id,
                        'producto_id'        => $producto['producto_id'],
                    ],
                    [
                        'orden_cotizaciones_id' => $orden->orden_cotizaciones_id,
                        'entrega_esperada'      => $producto['entrega_esperada'],
                        'descripcion'           => $producto['descripcion'] ?? '',
                        'codigo_barras'         => $producto['codigo_barras'] ?? '',
                        'referencia'            => $producto['referencia'] ?? '',
                        'cantidad'              => $producto['cantidad'],
                        'precio_unitario'       => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento'  => $producto['porcentaje_descuento'] ?? 0,
                        'importe'               => $producto['importe'] ?? 0,
                    ]
                );
                // 👇 Diferenciar si es un insert o un update
                if ($detalle->wasRecentlyCreated) {
                    $detalle->usuario_creacion = $validated['usuario_id'];
                } else {
                    $detalle->usuario_actualizacion = $validated['usuario_id'];
                }

                $detalle->save();

                $productosIds[] = $detalle->id;
            }

            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();



        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error interno: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($orden_compra_id)
    {
        $ordenCompraQuery = OrdenCompra::with([
            'almacen',
            'proveedor',
            'tipoMoneda',
            'detalles',
            'detalles.producto',
            'detalles.producto.modelo',
            'detalles.producto.subCategoria',
            ]);

        /*if ($orden_compra_id) {
            $ordenCompraQuery->with([
                'orden_compras' => function ($q) use ($orden_compra_id) {
                    $q->where('orden_compras.id', $orden_compra_id);
                },
                'orden_compras.proveedor',
                'orden_compras.tipoMoneda',
                'orden_compras.detalles',
                'orden_compras.detalles.producto',
                'orden_compras.detalles.producto.modelo',
                'orden_compras.detalles.producto.subCategoria',
                'orden_compras.ordenesCompra',
            ]);
        }*/

        $ordenCompraQuery->where('orden_compras.id', $orden_compra_id);
        $ordenCompra = $ordenCompraQuery->firstOrFail();

        return Inertia::render('Compras/ComprasOrdenes/NuevaOrdenCompra/Index', [
            'ordenCompraElegida' => $ordenCompra,
            'impuestos' => Impuesto::all(),
            'proveedores' => [
                'data' => Proveedor::with('padron')->get()
            ],
            'tipoMonedas' => TipoMoneda::all(),
            'almacenDestino' => Almacen::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    ////////////Guardar
    public function guardar(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'ordenCompra' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'entrega_esperada' => 'required|date',
            'almacen' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.entrega_esperada' => 'required|date',
            'productos.*.descripcion' => 'required|string',
            'productos.*.codigo_barras' => 'nullable|string',
            'productos.*.referencia' => 'nullable|string',
            'productos.*.cantidad' => 'required|numeric|min:1',
            'productos.*.precio_unitario' => 'nullable|numeric',
            'productos.*.porcentaje_descuento' => 'nullable|numeric',
            'productos.*.importe' => 'nullable|numeric',
        ]);

        $proveedor = Proveedor::where('nombre_fantasia', $validated['proveedor'])->firstOrFail();

        DB::beginTransaction();

        try {
           /// 1)orden de compra
            if (!empty($validated['ordenCompra'])) {
                $orden = ordenCompra::findOrFail($validated['ordenCompra']);
                $orden->update([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);


            } else {
                $orden = ordenCompra::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_creacion' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado' => 'Pendiente',
                ]);
            }


             // 🔵 2) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                $detalle = OrdenCompraDetalle::updateOrCreate(
                    [
                        // 🔑 Claves para identificar si ya existe
                        'orden_compras_id'   => $orden->id,
                        'producto_id'        => $producto['producto_id'],
                    ],
                    [
                        'orden_cotizaciones_id' => $orden->orden_cotizaciones_id,
                        'entrega_esperada'      => $producto['entrega_esperada'],
                        'descripcion'           => $producto['descripcion'] ?? '',
                        'codigo_barras'         => $producto['codigo_barras'] ?? '',
                        'referencia'            => $producto['referencia'] ?? '',
                        'cantidad'              => $producto['cantidad'] ?? 0,
                        'precio_unitario'       => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento'  => $producto['porcentaje_descuento'] ?? 0,
                        'importe'               => $producto['importe'] ?? 0,
                        // 👇 esto evita el error en INSERT
                        'usuario_creacion'      => $validated['usuario_id'],
                    ]
                );
                // si fue update, setear usuario_actualizacion
                if (! $detalle->wasRecentlyCreated) {
                    $detalle->usuario_actualizacion = $validated['usuario_id'];
                    $detalle->save();
                }

                $productosIds[] = $detalle->id;
            }

            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();



        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error interno: ' . $e->getMessage(),
            ], 500);
        }
    }

    ////////CANCELAR ORDEN DE COMPRA
    public function cancelar(Request $request)
    {
        $request->validate([
            'ordenCompra' => 'required|integer|exists:orden_compras,id'
        ]);

        $orden = OrdenCompra::find($request->ordenCompra);

        if ($orden->estado === 'Confirmada') {
            return redirect()->back()->with('error', 'No se puede cancelar una orden confirmada');
        }

        $orden->estado = 'Cancelada';
        $orden->save();

        return redirect()->back()->with('success', 'Orden de compra cancelada correctamente');
    }

}
