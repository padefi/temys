<?php

namespace App\Http\Controllers\Compras\OrdenCotizaciones;
use App\Http\Controllers\Controller;
use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCompra;
use App\Models\Compras\OrdenCompraDetalle;
use App\Models\General\Impuesto;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\General\TipoMoneda;
use Illuminate\Http\Request;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionArchivo;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;
use App\Models\Compras\SolicitudCompra;
use Illuminate\Support\Facades\DB;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class OrdenCotizacionesController extends Controller
{
    ////LISTAR ORDENES DE COTIZACION
    public function index(Request $request)
    {

        $solicitudesComprasListado = SolicitudCompra::with([
            'ordenesCotizacion',
            'ordenesCotizacion.proveedor',
            'ordenesCotizacion.tipoMoneda',
            'origen',
            'ordenesCotizacion.ordenesCompra',
            'ordenesCotizacion.almacenDestino'
        ])->get();



        return Inertia::render('Compras/CotizacionesOrdenes/Index', [
            'solicitudesComprasListado' => $solicitudesComprasListado,
            //'module' => '3',
        ]);

    }

    ////CREAR NUEVA COTIZACION
    public function nuevaCotizacion()
    {
        return Inertia::render('Compras/CotizacionesOrdenes/NuevaCotizacion/Index', [
            'proveedores' => [
            'data' => Proveedor::with('padron')->get() // Estructura que espera el frontend
            ],
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
            'impuestos' => Impuesto::all(),
            //'module' => '3',

        ]);
    }

    ////ENVIAR COTIZACION
    public function enviarCotizacion(Request $request)
    {

        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'cotizar_antes_de' => 'required|date',
            'entrega_esperada' => 'required|date',
            'almacen' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.descripcion' => 'required|string',
            'productos.*.entrega_esperada' => 'required|date',
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
             // 🔵 1) Solicitud
            if (!empty($validated['solicitudCompra'])) {
                $solicitud = SolicitudCompra::findOrFail($validated['solicitudCompra']);
                $solicitud->update([
                    'estado' => 'Aceptada',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $solicitud = SolicitudCompra::create([
                    'origen_id' => 1, // AJUSTAR según tu lógica
                    'descripcion' => 'Solicitud generada automáticamente',
                    'estado' => 'Aceptada',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                ]);
            }
            // 2) Orden de compra
            if (!empty($validated['ordenCotizacion'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado'                => 'Confirmada',
                ]);
            } else {
                $orden = OrdenCotizacion::create([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_id'            => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado'                => 'Confirmada',
                ]);
            }

            // 🔵 3) Vincular
            if (!$orden->solicitudCompra()->where('solicitud_compras.id', $solicitud->id)->exists()) {
                $orden->solicitudCompra()->attach($solicitud->id);
            }

            // 4) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualiza detalle existente
                    $detalle = OrdenCotizacionDetalle::where('id', $producto['id'])
                        ->where('orden_cotizaciones_id', $orden->id)
                        ->first();

                    if ($detalle) {
                        $detalle->update([
                            'entrega_esperada'     => $producto['entrega_esperada'],
                            'descripcion'          => $producto['descripcion'] ?? '',
                            'codigo_barras'        => $producto['codigo_barras'] ?? '',
                            'referencia'           => $producto['referencia'] ?? '',
                            'cantidad'             => $producto['cantidad'] ?? 0,
                            'precio_unitario'      => $producto['precio_unitario'] ?? 0,
                            'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                            'importe'              => $producto['importe'] ?? 0,
                            'usuario_actualizacion'=> $validated['usuario_id'],
                        ]);
                    }
                } else {
                    // 🆕 Crea nuevo detalle
                    $detalle = OrdenCotizacionDetalle::create([
                        'orden_cotizaciones_id' => $orden->id,
                        'producto_id'           => $producto['producto_id'],
                        'entrega_esperada'      => $producto['entrega_esperada'],
                        'descripcion'           => $producto['descripcion'] ?? '',
                        'codigo_barras'         => $producto['codigo_barras'] ?? '',
                        'referencia'            => $producto['referencia'] ?? '',
                        'cantidad'              => $producto['cantidad'] ?? 0,
                        'precio_unitario'       => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento'  => $producto['porcentaje_descuento'] ?? 0,
                        'importe'               => $producto['importe'] ?? 0,
                        'usuario_id'            => $validated['usuario_id'],
                    ]);
                }

                $productosIds[] = $detalle->id;
            }

            // 🔴 Borrar los detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();


            return redirect()->back()->with('success', 'Orden de cotización confirmada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', 'Error al enviada la orden de cotización.');
        }

    }

    ////CONFIRMAR COTIZACION
    public function confirmarCotizacion(Request $request)
    {


        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'cotizar_antes_de' => 'required|date',
            'entrega_esperada' => 'required|date',
            'almacen' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.descripcion' => 'required|string',
            'productos.*.entrega_esperada' => 'required|date',
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
             // 🔵 1) Solicitud
            if (!empty($validated['solicitudCompra'])) {
                $solicitud = SolicitudCompra::findOrFail($validated['solicitudCompra']);
                $solicitud->update([
                    'estado' => 'Aceptada',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $solicitud = SolicitudCompra::create([
                    'origen_id' => 1, // AJUSTAR según tu lógica
                    'descripcion' => 'Solicitud generada automáticamente',
                    'estado' => 'Aceptada',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                ]);
            }
            // 2) Orden de compra
            if (!empty($validated['ordenCotizacion'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado'                => 'Confirmada',
                ]);
            } else {
                $orden = OrdenCotizacion::create([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_id'            => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado'                => 'Confirmada',
                ]);
            }

            // 🔵 3) Vincular
            if (!$orden->solicitudCompra()->where('solicitud_compras.id', $solicitud->id)->exists()) {
                $orden->solicitudCompra()->attach($solicitud->id);
            }

            // 4) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualiza detalle existente
                    $detalle = OrdenCotizacionDetalle::where('id', $producto['id'])
                        ->where('orden_cotizaciones_id', $orden->id)
                        ->first();

                    if ($detalle) {
                        $detalle->update([
                            'entrega_esperada'     => $producto['entrega_esperada'],
                            'descripcion'          => $producto['descripcion'] ?? '',
                            'codigo_barras'        => $producto['codigo_barras'] ?? '',
                            'referencia'           => $producto['referencia'] ?? '',
                            'cantidad'             => $producto['cantidad'] ?? 0,
                            'precio_unitario'      => $producto['precio_unitario'] ?? 0,
                            'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                            'importe'              => $producto['importe'] ?? 0,
                            'usuario_actualizacion'=> $validated['usuario_id'],
                        ]);
                    }
                } else {
                    // 🆕 Crea nuevo detalle
                    $detalle = OrdenCotizacionDetalle::create([
                        'orden_cotizaciones_id' => $orden->id,
                        'producto_id'           => $producto['producto_id'],
                        'entrega_esperada'      => $producto['entrega_esperada'],
                        'descripcion'           => $producto['descripcion'] ?? '',
                        'codigo_barras'         => $producto['codigo_barras'] ?? '',
                        'referencia'            => $producto['referencia'] ?? '',
                        'cantidad'              => $producto['cantidad'] ?? 0,
                        'precio_unitario'       => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento'  => $producto['porcentaje_descuento'] ?? 0,
                        'importe'               => $producto['importe'] ?? 0,
                        'usuario_id'            => $validated['usuario_id'],
                    ]);
                }

                $productosIds[] = $detalle->id;
            }

            // 🔴 Borrar los detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();


        return redirect()->back()->with('success', 'Orden de cotización confirmada correctamente.');

        } catch (\Exception $e) {
            DB::rollBack();

        return redirect()->back()->with('danger', $e);

        }
    }

    ////VISUALIZAR DETALLE DE COTIZACION
    public function show($solicitud_id, $orden_id = null)
    {
        $solicitudCompraQuery = SolicitudCompra::with(['origen']);

        if ($orden_id) {
            $solicitudCompraQuery->with([
                'ordenesCotizacion' => function ($q) use ($orden_id) {
                    $q->where('orden_cotizaciones.id', $orden_id);
                },
                'ordenesCotizacion.proveedor',
                'ordenesCotizacion.tipoMoneda',
                'ordenesCotizacion.detalles',
                'ordenesCotizacion.almacenDestino',
                'ordenesCotizacion.almacen',
                'ordenesCotizacion.detalles.producto',
                'ordenesCotizacion.detalles.producto.modelo',
                'ordenesCotizacion.detalles.producto.subCategoria',
                'ordenesCotizacion.ordenesCompra',
                'ordenesCotizacion.archivos',
            ]);
        }

        $solicitudCompraQuery->where('solicitud_compras.id', $solicitud_id);
        $solicitudCompra = $solicitudCompraQuery->firstOrFail();

        return Inertia::render('Compras/CotizacionesOrdenes/NuevaCotizacion/Index', [
            'solicitudCompraElegida' => $solicitudCompra,
            'impuestos' => Impuesto::all(),
            'proveedores' => [
                'data' => Proveedor::with('padron')->get()
            ],
            'almacenDestino' => Almacen::all(),
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    ////RECHAZAR COTIZACION
    public function rechazarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudCompra = SolicitudCompra::findOrFail($solicitud_id);
        $solicitudCompra->estado = 'Rechazada';
        $solicitudCompra->save();

        return redirect()->back()->with('success', 'Solicitud rechazada.');
    }

    ////ACEPTAR COTIZACION
    public function aceptarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudCompra = SolicitudCompra::findOrFail($solicitud_id);
        $solicitudCompra->estado = 'Aceptada';
        $solicitudCompra->save();


        return redirect()->back()->with('success', 'Solicitud aceptada.');
    }

    ////GENERAR ORDEN DE COMPRA
    public function generarOrdenCompra(Request $request)
    {
        $validated = $request->validate([
            'ordenes' => 'required|array',
            'ordenes.*' => 'integer',
            'usuario_id' => 'required|integer',
        ]);

        $ordenesCotizacionIds = $validated['ordenes'];

        if (empty($ordenesCotizacionIds)) {
            return back()->with('error', 'No se seleccionaron órdenes para generar la orden de compra.');
        }

        $ordenesCotizacion = OrdenCotizacion::whereIn('id', $ordenesCotizacionIds)->with('detalles')->get();

        if ($ordenesCotizacion->isEmpty()) {
            return back()->with('error', 'No se encontraron órdenes de cotización.');
        }

        DB::beginTransaction();

        try {
            foreach ($ordenesCotizacion as $oc) {
                // Crear la orden de compra individual para cada orden de cotización
                $ordenCompra = OrdenCompra::create([
                    'proveedor_id' => $oc->proveedor_id,
                    'moneda_id' => $oc->moneda_id,
                    'entrega_esperada' => $oc->entrega_esperada,
                    'almacen_destino_id' => $oc->almacen_destino_id,
                    'observacion' => $oc->observacion,
                    'estado' => 'Pendiente',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => $validated['usuario_id'],
                    'fecha_actualizacion' => null,
                ]);

                // Relacionar la orden de compra con la orden de cotización
                $ordenCompra->ordenesCotizacion()->attach($oc->id);

                // Copiar los detalles
                foreach ($oc->detalles as $detalle) {
                    OrdenCompraDetalle::create([
                        'orden_compras_id' => $ordenCompra->id,
                        'orden_cotizaciones_id' => $oc->id,
                        'producto_id' => $detalle->producto_id,
                        'descripcion' => $detalle->descripcion ?? '',
                        'cantidad' => $detalle->cantidad,
                        'precio_unitario' => $detalle->precio_unitario,
                        'porcentaje_descuento' => $detalle->porcentaje_descuento,
                        'importe' => $detalle->importe,
                        'usuario_creacion' => $validated['usuario_id'],
                        'created_at' => now(),
                    ]);
                }

                // Cambiar estado de la orden de cotización
                $oc->estado = 'Confirmada';
                $oc->save();
            }

            DB::commit();

            return back()->with('success', 'Ordenes de compra generadas correctamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al generar ordenes de compra', ['error' => $e->getMessage()]);
            return back()->with('error', 'Error al generar las órdenes de compra: ' . $e->getMessage());
        }
    }

    ////GUARDAR ORDEN DE COTIZACION
    public function guardar(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|numeric',
            'cotizar_antes_de' => 'required|date',
            'entrega_esperada' => 'required|date',
            'almacen' => 'required|numeric',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.descripcion' => 'required|string',
            'productos.*.entrega_esperada' => 'required|date',
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
            // 1) Orden de compra
            if (!empty($validated['ordenCotizacion'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $orden = OrdenCotizacion::create([
                    'proveedor_id'          => $proveedor->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_id'            => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado'                => 'Pendiente',
                ]);
            }

            // 2) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualiza detalle existente
                    $detalle = OrdenCotizacionDetalle::where('id', $producto['id'])
                        ->where('orden_cotizaciones_id', $orden->id)
                        ->first();

                    if ($detalle) {
                        $detalle->update([
                            'entrega_esperada'     => $producto['entrega_esperada'],
                            'descripcion'          => $producto['descripcion'] ?? '',
                            'codigo_barras'        => $producto['codigo_barras'] ?? '',
                            'referencia'           => $producto['referencia'] ?? '',
                            'cantidad'             => $producto['cantidad'] ?? 0,
                            'precio_unitario'      => $producto['precio_unitario'] ?? 0,
                            'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                            'importe'              => $producto['importe'] ?? 0,
                            'usuario_actualizacion'=> $validated['usuario_id'],
                        ]);
                    }
                } else {
                    // 🆕 Crea nuevo detalle
                    $detalle = OrdenCotizacionDetalle::create([
                        'orden_cotizaciones_id' => $orden->id,
                        'producto_id'           => $producto['producto_id'],
                        'entrega_esperada'      => $producto['entrega_esperada'],
                        'descripcion'           => $producto['descripcion'] ?? '',
                        'codigo_barras'         => $producto['codigo_barras'] ?? '',
                        'referencia'            => $producto['referencia'] ?? '',
                        'cantidad'              => $producto['cantidad'] ?? 0,
                        'precio_unitario'       => $producto['precio_unitario'] ?? 0,
                        'porcentaje_descuento'  => $producto['porcentaje_descuento'] ?? 0,
                        'importe'               => $producto['importe'] ?? 0,
                        'usuario_id'            => $validated['usuario_id'],
                    ]);
                }

                $productosIds[] = $detalle->id;
            }

            // 🔴 Borrar los detalles que ya no están en el request
            $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->delete();

            DB::commit();


            return redirect()->back()->with('success', 'Orden de cotización guardada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', 'Error al guardar la orden de cotización.');
        }
    }

    ////SUBIR ARCHIVO A COTIZACION
    public function subirArchivo(Request $request, $id)
    {
        $request->validate([
            'archivo' => 'required|file|max:10240',
        ]);

        $orden = OrdenCotizacion::findOrFail($id);

        $file = $request->file('archivo');
        $path = $file->store('cotizaciones_ordenes');

        $orden->archivos()->create([
            'nombre' => $file->getClientOriginalName(),
            'path'   => $path,
            'mime'   => $file->getMimeType(),
            'size'   => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    ////ELIMINAR ARCHIVO DE COTIZACION
    public function eliminarArchivo(OrdenCotizacionArchivo $archivo)
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
            return redirect()->back()->with('success', 'El archivo no pudo ser eliminado', 500);
        }
    }

    ////VISUALIZAR ARCHIVO DE COTIZACION
    public function visualizarArchivo(OrdenCotizacionArchivo $archivo)
    {

    $path = storage_path('app/private/' . ltrim($archivo->path, '/'));


    if (!file_exists($path)) {
        abort(404, 'Archivo no encontrado: ' . $path);
    }

    return response()->file($path);
    }

}
