<?php

namespace App\Http\Controllers\Compras\OrdenCompras;
use App\Http\Controllers\Controller;
use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCompra;
use App\Models\Compras\OrdenCompraArchivo;
use App\Models\Compras\OrdenCompraDetalle;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\General\Impuesto;
use App\Models\General\TipoMoneda;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;



class OrdenComprasController extends Controller
{

    ////LISTAR ORDENES DE COMPRA
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

    ////CREAR NUEVA ORDEN DE COMPRA
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

    ////CONFIRMAR ORDEN DE COMPRA
    public function confirmarOrdenCompra(Request $request)
    {
        Log::info('Confirmar Orden de Compra', $request->all());
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'ordenCompra' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'cotizacion_moneda' => 'nullable|numeric',
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
            'productos.*.impuestos_seleccionados' => 'nullable|array',
            'productos.*.impuestos_seleccionados.*' => 'exists:impuestos,id',
            'productos.*.co_cuenta_id' => 'nullable|numeric',
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
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado' => 'Confirmada',
                ]);

            } else {
                $orden = ordenCompra::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_creacion' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado' => 'Confirmada',
                ]);
            }

             // 🔵 2) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualizar detalle existente
                    $detalle = OrdenCompraDetalle::findOrFail($producto['id']);
                    $detalle->update([
                        'producto_id' => $producto['producto_id'],
                        'entrega_esperada' => $producto['entrega_esperada'],
                        'descripcion' => $producto['descripcion'] ?? '',
                        'codigo_barras' => $producto['codigo_barras'] ?? '',
                        'referencia' => $producto['referencia'] ?? '',
                        'cantidad' => $producto['cantidad'] ?? 0,
                        'precio_unitario' => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                        'importe' => $producto['importe'] ?? 0,
                        'co_cuenta_id' => $producto['co_cuenta_id'] ?? null,
                        'usuario_actualizacion' => $validated['usuario_id'],
                    ]);

                } else {

                    // 🆕 Crear nuevo detalle
                    $detalle = OrdenCompraDetalle::create([
                        'orden_compras_id' => $orden->id,
                        'producto_id' => $producto['producto_id'],
                        'orden_cotizaciones_id' => $orden->orden_cotizaciones_id,
                        'entrega_esperada' => $producto['entrega_esperada'],
                        'descripcion' => $producto['descripcion'] ?? '',
                        'codigo_barras' => $producto['codigo_barras'] ?? '',
                        'referencia' => $producto['referencia'] ?? '',
                        'cantidad' => $producto['cantidad'] ?? 0,
                        'precio_unitario' => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                        'importe' => $producto['importe'] ?? 0,
                        'co_cuenta_id' => $producto['co_cuenta_id'] ?? null,
                        'usuario_creacion' => $validated['usuario_id'],
                    ]);
                }

                // pivot impuestos
                $impuestos = $producto['impuestos_seleccionados'] ?? [];
                $detalle->impuestos()->sync($impuestos);

                $productosIds[] = $detalle->id;
            }

            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();


            DB::commit();

        return redirect()->back()->with('success', 'Orden de Compra confirmada correctamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', $e);
        }
    }

    ////OBTENER ORDEN DE COMPRA POR ID
    public function show($orden_compra_id)
    {
        $ordenCompraQuery = OrdenCompra::with([
            'almacen',
            'proveedor',
            'tipoMoneda',
            'archivos',
            'ordenesCotizacion.archivos', // 👈 carga los archivos de cada OC
            'detalles.producto.cuentaContable',
            'detalles',
            'detalles.producto',
            'detalles.producto.modelo',
            'detalles.producto.subCategoria',
            'detalles.impuestos',
            'comprobantesProveedores',
            'comprobantesProveedores.archivos',
            'comprobantesProveedores.detalles',
            'comprobantesProveedores.condicionVenta',
            'comprobantesProveedores.tipoComprobante',
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
            'co_cuentas' => Cuenta::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    ////GUARDAR ORDEN DE COMPRA
    public function guardar(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'ordenCompra' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'cotizacion_moneda' => 'nullable|numeric',
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
            'productos.*.impuestos_seleccionados' => 'nullable|array',
            'productos.*.impuestos_seleccionados.*' => 'exists:impuestos,id',
            'productos.*.co_cuenta_id' => 'nullable|numeric',
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
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);


            } else {
                $orden = ordenCompra::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
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
            if (!empty($producto['id'])) {
                // 🔄 Actualizar detalle existente
                $detalle = OrdenCompraDetalle::findOrFail($producto['id']);
                $detalle->update([
                    'producto_id' => $producto['producto_id'],
                    'entrega_esperada' => $producto['entrega_esperada'],
                    'descripcion' => $producto['descripcion'] ?? '',
                    'codigo_barras' => $producto['codigo_barras'] ?? '',
                    'referencia' => $producto['referencia'] ?? '',
                    'cantidad' => $producto['cantidad'] ?? 0,
                    'precio_unitario' => $producto['precio_unitario'] ?? 0,
                    'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                    'importe' => $producto['importe'] ?? 0,
                    'co_cuenta_id' => $producto['co_cuenta_id'] ?? null,
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);

            } else {

                // 🆕 Crear nuevo detalle
                $detalle = OrdenCompraDetalle::create([
                    'orden_compras_id' => $orden->id,
                    'producto_id' => $producto['producto_id'],
                    'orden_cotizaciones_id' => $orden->orden_cotizaciones_id,
                    'entrega_esperada' => $producto['entrega_esperada'],
                    'descripcion' => $producto['descripcion'] ?? '',
                    'codigo_barras' => $producto['codigo_barras'] ?? '',
                    'referencia' => $producto['referencia'] ?? '',
                    'cantidad' => $producto['cantidad'] ?? 0,
                    'precio_unitario' => $producto['precio_unitario'] ?? 0,
                    'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                    'importe' => $producto['importe'] ?? 0,
                    'co_cuenta_id' => $producto['co_cuenta_id'] ?? null,
                    'usuario_creacion' => $validated['usuario_id'],
                ]);
            }

            // pivot impuestos
            $impuestos = $producto['impuestos_seleccionados'] ?? [];
            $detalle->impuestos()->sync($impuestos);

            $productosIds[] = $detalle->id;
        }



            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();


        return redirect()->back()->with('success', 'Orden de Compra guardada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', 'Error al guardar la orden de Compra.');
        }
    }

    ///////CANCELAR ORDEN DE COMPRA
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

    ////SUBIR ARCHIVO A ORDEN DE COMPRA
    public function subirArchivo(Request $request, $id)
    {
        $request->validate([
            'archivo' => 'required|file|max:10240',
        ]);

        $orden = OrdenCompra::findOrFail($id);

        $file = $request->file('archivo');
        $path = $file->store('ordenes_compras');

        $orden->archivos()->create([
            'nombre' => $file->getClientOriginalName(),
            'path'   => $path,
            'mime'   => $file->getMimeType(),
            'size'   => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    ////ELIMINAR ARCHIVO DE ORDEN DE COMPRA
    public function eliminarArchivo(OrdenCompraArchivo $archivo)
    {
        try {
            // Eliminar el archivo físico
            if (Storage::exists($archivo->path)) {
                Storage::delete($archivo->path);
            }

            // Eliminar registro en la DB
            $archivo->delete();

            return redirect()->back()->with('success', 'Archivo eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('danger', 'El archivo no pudo ser eliminado', 500);
        }
    }

    ////VISUALIZAR ARCHIVO DE ORDEN DE COMPRA
    public function visualizarArchivo(OrdenCompraArchivo $archivo)
    {
        // Esto asume que los archivos están en storage/app/private/ordenes-compras
        return response()->file(storage_path('app/private/' . $archivo->path));
    }

}
