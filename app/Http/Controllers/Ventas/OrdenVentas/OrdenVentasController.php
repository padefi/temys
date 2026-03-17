<?php

namespace App\Http\Controllers\Ventas\OrdenVentas;
use App\Http\Controllers\Controller;
use App\Models\Almacenes\Almacen;
use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\ComprobanteArchivo;
use App\Models\Ventas\OrdenVenta;
use App\Models\Ventas\OrdenVentaArchivo;
use App\Models\Ventas\OrdenVentaDetalle;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\General\Impuesto;
use App\Models\General\TipoMoneda;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioRecepcionProductoDetalle;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;



class OrdenVentasController extends Controller
{

    ////LISTAR ORDENES DE VENTA
    public function index()
    {

        $ordenesVentasListado = OrdenVenta::with(
            [
                'detalles',
                'detalles.producto',
                'detalles.producto.modelo',
                'detalles.producto.modelo.marca',
                'detalles.producto.subcategoria',
                'ordenesCotizacionVentas',
                'ordenesCotizacionVentas.solicitudVenta',
                'ordenesCotizacionVentas.solicitudVenta.origen',
                'almacenDestino',
                'cliente',
                'ordenesCotizacionVentas.tipoMoneda',
                'ordenesCotizacionVentas.ordenesVenta'
            ])->get();

        return Inertia::render('Ventas/VentasOrdenes/Index', [
            'ordenesVentasListado' => $ordenesVentasListado,
        ]);

    }

    ////CREAR NUEVA ORDEN DE VENTA
    public function nuevaOrdenVenta()
    {
        return Inertia::render('Ventas/VentasOrdenes/NuevaOrdenVenta/Index', [
            'clientes' => [
            'data' => Cliente::with('padron')->get() // Estructura que espera el frontend
            ],
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
            'impuestos' => Impuesto::all(),
            'almacenDestino' => Almacen::all(),
            //'module' => '3',

        ]);
    }

    ////CONFIRMAR ORDEN DE VENTA
    public function confirmarOrdenVenta(Request $request)
    {

        $validated = $request->validate([
            'solicitudVenta' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'ordenVenta' => 'nullable|numeric',
            'cliente' => 'required|string',
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

        $cliente = Cliente::where('nombre', $validated['cliente'])->firstOrFail();

        DB::beginTransaction();

        try {
            /// 1)orden de venta
            if (!empty($validated['ordenVenta'])) {
                $orden = OrdenVenta::findOrFail($validated['ordenVenta']);
                $orden->update([
                    'cliente_id' => $cliente->id,
                    'moneda_id' => $validated['moneda'],
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado' => 'Confirmada',
                ]);

            } else {
                $orden = OrdenVenta::create([
                    'cliente_id' => $cliente->id,
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
                    $detalle = OrdenVentaDetalle::findOrFail($producto['id']);
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
                    $detalle = OrdenVentaDetalle::create([
                        'orden_ventas_id' => $orden->id,
                        'producto_id' => $producto['producto_id'],
                        'orden_cotizaciones_ventas_id' => $orden->orden_cotizaciones_ventas_id,
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

            // pivot impuestos — usar array vacío si no vino nada
            $impuestos = $producto['impuestos_seleccionados'] ?? [];
            $detalle->impuestos()->sync(is_array($impuestos) ? $impuestos : []);

                $productosIds[] = $detalle->id;
            }

            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();


            //////////////////////////////////////////////////////////////
            // ✅ Crear la recepción asociada a esta orden
            $recepcion = InventarioRecepcionProducto::create([
                'origen_id' => 1, //id de compras
                'destino_id' => $validated['almacen'],
                'orden_entrega_id' => null,
                'tipo_recepcion' => 'Orden de compra',
                'fecha_recepcion' => now(),
                'estado' => 'Pendiente',
                'usuario_creacion' => $validated['usuario_id'],
            ]);

            foreach ($validated['productos'] as $producto) {
                InventarioRecepcionProductoDetalle::create([
                    'recepcion_id' => $recepcion->id,
                    'producto_id' => $producto['producto_id'],
                    'cantidad_recibida' => 0,
                    'cantidad_esperada' => $producto['cantidad'] ?? 0,
                    'estado' => 'completo',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => $validated['usuario_id'],
                ]);
            }
            ////////////////////////////////////////////////////////////

            DB::commit();

        return redirect()->back()->with('success', 'Orden de Venta confirmada correctamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('danger', $e->getMessage());
        }
    }

    ////OBTENER ORDEN DE VENTA POR ID
    public function show($orden_venta_id)
    {
        $ordenVentaQuery = OrdenVenta::with([
            'almacen',
            'cliente',
            'tipoMoneda',
            'archivos',
            'ordenesCotizacionVentas.archivos', // 👈 carga los archivos de cada OC
            'detalles.producto.cuentaContable',
            'detalles',
            'detalles.producto',
            'detalles.producto.modelo',
            'detalles.producto.subCategoria',
            'comprobantes',
            'comprobantes.archivos',
            'comprobantes.detalles',
            'comprobantes.condicionVenta',
            'comprobantes.tipoComprobante',
            'detalles.detallesImpuesto',
            ]);



        $ordenVentaQuery->where('orden_ventas.id', $orden_venta_id);
        $ordenVenta = $ordenVentaQuery->firstOrFail();

        return Inertia::render('Ventas/VentasOrdenes/NuevaOrdenVenta/Index', [
            'ordenVentaElegida' => $ordenVenta,
            'impuestos' => Impuesto::all(),
            'clientes' => [
                'data' => Cliente::with('padron')->get()
            ],
            'tipoMonedas' => TipoMoneda::all(),
            'almacenDestino' => Almacen::all(),
            'co_cuentas' => Cuenta::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    ////GUARDAR ORDEN DE VENTA
    public function guardar(Request $request)
    {
        $validated = $request->validate([
            'solicitudVenta' => 'nullable|numeric',
            'ordenCotizacionVenta' => 'nullable|numeric',
            'ordenVenta' => 'nullable|numeric',
            'cliente' => 'required|string',
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

        $cliente = Cliente::where('nombre', $validated['cliente'])->firstOrFail();

        DB::beginTransaction();

        try {

           /// 1)orden de venta
            if (!empty($validated['ordenVenta'])) {
                $orden = OrdenVenta::findOrFail($validated['ordenVenta']);
                $orden->update([
                    'cliente_id' => $cliente->id,
                    'moneda_id' => $validated['moneda'],
                    'cotizacion_moneda' => $validated['cotizacion_moneda'] ?? null,
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);


            } else {
                $orden = OrdenVenta::create([
                    'cliente_id' => $cliente->id,
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
                $detalle = OrdenVentaDetalle::findOrFail($producto['id']);
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
                $detalle = OrdenVentaDetalle::create([
                    'orden_ventas_id' => $orden->id,
                    'producto_id' => $producto['producto_id'],
                    'orden_cotizaciones_ventas_id' => $orden->orden_cotizaciones_ventas_id,
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

            // pivot impuestos — usar array vacío si no vino nada
            $impuestos = $producto['impuestos_seleccionados'] ?? [];
            $detalle->impuestos()->sync(is_array($impuestos) ? $impuestos : []);

            $productosIds[] = $detalle->id;
        }



            // 🔴 Opcional: borrar detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();


        return redirect()->back()->with('success', 'Orden de Venta guardada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', 'Error al guardar la orden de Venta.');
        }
    }

    ///////CANCELAR ORDEN DE VENTA
    public function cancelar(Request $request)
    {
        $request->validate([
            'ordenVenta' => 'required|integer|exists:orden_ventas,id'
        ]);

        $orden = OrdenVenta::find($request->ordenVenta);

        if ($orden->estado === 'Confirmada') {
            return redirect()->back()->with('error', 'No se puede cancelar una orden confirmada');
        }

        $orden->estado = 'Cancelada';
        $orden->save();

        return redirect()->back()->with('success', 'Orden de venta cancelada correctamente');
    }

    ////SUBIR ARCHIVO A ORDEN DE VENTA
    public function subirArchivo(Request $request, $id)
    {
        $request->validate([
            'archivo' => 'required|file|max:10240',
        ]);

        $orden = OrdenVenta::findOrFail($id);

        $file = $request->file('archivo');
        $path = $file->store('ordenes_ventas');

        $orden->archivos()->create([
            'nombre' => $file->getClientOriginalName(),
            'path'   => $path,
            'mime'   => $file->getMimeType(),
            'size'   => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    ////ELIMINAR ARCHIVO DE ORDEN DE VENTA
    public function eliminarArchivo(OrdenVentaArchivo $archivo)
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

    ////VISUALIZAR ARCHIVO DE ORDEN DE VENTA
    public function visualizarArchivo(OrdenVentaArchivo $archivo)
    {
        // Esto asume que los archivos están en storage/app/private/ordenes-ventas
        return response()->file(storage_path('app/private/' . $archivo->path));
    }


    //////////////////////////////
    ////SUBIR ARCHIVO A FACTURAS
    public function subirArchivoFactura(Request $request, $id)
    {
        $request->validate([
            'archivo' => 'required|file|max:10240',
        ]);

        $comprobante = Comprobante::findOrFail($id);

        $file = $request->file('archivo');
        $path = $file->store('comprobantes_clientes');

        $comprobante->archivos()->create([
            'nombre' => $file->getClientOriginalName(),
            'path'   => $path,
            'mime'   => $file->getMimeType(),
            'size'   => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    ////ELIMINAR ARCHIVO DE FACTURAS
    public function eliminarArchivoFactura(ComprobanteArchivo $archivo)
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

    ////VISUALIZAR ARCHIVO DE FACTURAS
    public function visualizarArchivoFactura(ComprobanteArchivo $archivo)
    {
        // Esto asume que los archivos están en storage/app/private/comprobantes-clientes
        return response()->file(storage_path('app/private/' . $archivo->path));
    }

}
