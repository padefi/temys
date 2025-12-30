<?php

namespace App\Http\Controllers\Ventas\OrdenCotizacionesVentas;
use App\Http\Controllers\Controller;
use App\Models\Almacenes\Almacen;
use App\Models\Ventas\OrdenVenta;
use App\Models\Ventas\OrdenVentaDetalle;
use App\Models\Ventas\OrdenVentaDetalleImpuesto;
use App\Models\General\Impuesto;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\General\TipoMoneda;
use Illuminate\Http\Request;
use App\Models\Ventas\OrdenCotizacion\OrdenCotizacion;
use App\Models\Ventas\OrdenCotizacion\OrdenCotizacionArchivo;
use App\Models\Ventas\OrdenCotizacion\OrdenCotizacionDetalle;
use App\Models\Ventas\SolicitudVenta;
use App\Models\Ventas\SolicitudVentaOrdenCotizacion;
use Illuminate\Support\Facades\DB;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Ventas\ordenCotizacionVenta;
use App\Models\Ventas\ordenCotizacionVentaArchivo;
use App\Models\Ventas\ordenCotizacionVentaDetalle;
use App\Models\Ventas\SolicitudVentaOrdenCotizacionVenta;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class OrdenCotizacionesVentasController extends Controller
{
    ////LISTAR ORDENES DE COTIZACION
    public function index(Request $request)
    {

        $solicitudesVentasListado = SolicitudVenta::with([
            'ordenCotizacionVenta',
            'ordenCotizacionVenta.cliente',
            'ordenCotizacionVenta.tipoMoneda',
            'origen',
            'ordenCotizacionVenta.ordenesVenta',
            'ordenCotizacionVenta.almacenDestino'
        ])->get();



        return Inertia::render('Ventas/CotizacionesOrdenes/Index', [
            'solicitudesVentasListado' => $solicitudesVentasListado,
            //'module' => '3',
        ]);

    }

    ////CREAR NUEVA COTIZACION
    public function nuevaCotizacion()
    {
        return Inertia::render('Ventas/CotizacionesOrdenes/NuevaCotizacion/Index', [
            'clientes' => [
            'data' => Cliente::with('padron')->get() // Estructura que espera el frontend
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
            'ordenCotizacionVenta' => 'nullable|numeric',
            'cliente' => 'required|string',
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
            'productos.*.impuestos_seleccionados' => 'sometimes|array|exists:impuestos,id',
        ]);

        $cliente = Cliente::where('nombre_fantasia', $validated['cliente'])->firstOrFail();

        DB::beginTransaction();

        try {
             // 🔵 1) Solicitud
            if (!empty($validated['solicitudVenta'])) {
                $solicitud = SolicitudVenta::findOrFail($validated['solicitudVenta']);
                $solicitud->update([
                    'estado' => 'Aceptada',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $solicitud = SolicitudVenta::create([
                    'origen_id' => 1, // AJUSTAR según tu lógica
                    'descripcion' => 'Solicitud generada automáticamente',
                    'estado' => 'Aceptada',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                ]);
            }
            // 🔵 2) Orden de venta
            if (!empty($validated['ordenCotizacionVenta'])) {
                $orden = ordenCotizacionVenta::findOrFail($validated['ordenCotizacionVenta']);
                $orden->update([
                    'cliente_id'            => $cliente->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado'                => 'Confirmada',
                ]);
            } else {
                $orden = OrdenCotizacionVenta::create([
                    'cliente_id'            => $cliente->id,
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
            if (!$orden->solicitudVenta()->where('solicitud_ventas.id', $solicitud->id)->exists()) {
                $orden->solicitudVenta()->attach($solicitud->id);
            }

            // 4) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualiza detalle existente
                    $detalle = ordenCotizacionVentaDetalle::where('id', $producto['id'])
                        ->where('orden_cotizaciones_ventas_id', $orden->id)
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
                    $detalle = ordenCotizacionVentaDetalle::create([
                        'orden_cotizaciones_ventas_id' => $orden->id,
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

                 // pivot impuestos — usar array vacío si no vino nada
                    $impuestos = $producto['impuestos_seleccionados'] ?? [];
                    $detalle->impuestos()->sync(is_array($impuestos) ? $impuestos : []);

                    $productosIds[] = $detalle->id;
            }

                    // 🔴 Borrar los detalles que ya no están en el request — con pivot detach
                    $detallesEliminar = $orden->detalles()
                        ->whereNotIn('id', $productosIds)
                        ->get();

                    foreach ($detallesEliminar as $detalle) {
                        $detalle->impuestos()->detach();
                        $detalle->delete();
                    }

                    DB::commit();



                    return redirect()->route('cotizacionesOrdenesVenta.show', [
                        'solicitud_id' => $validated['solicitudCompra'],
                        'orden_id' => $orden->id
                    ])->with('success', 'Orden de cotización enviada correctamente.');

                } catch (\Exception $e) {
                    DB::rollBack();

                    return redirect()->back()->with('danger', 'Error: ' . $e->getMessage());
                    dd($e->getMessage(), $e->getLine(), $e->getFile());
                }
            }

    ////CONFIRMAR COTIZACION
    public function confirmarCotizacion(Request $request)
    {


        $validated = $request->validate([
            'solicitudVenta' => 'nullable|numeric',
            'ordenCotizacionVenta' => 'nullable|numeric',
            'cliente' => 'required|string',
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
            'productos.*.impuestos_seleccionados' => 'sometimes|array|exists:impuestos,id',
        ]);

        $cliente = Cliente::where('nombre_fantasia', $validated['cliente'])->firstOrFail();

        DB::beginTransaction();

        try {
             // 🔵 1) Solicitud
            if (!empty($validated['solicitudVenta'])) {
                $solicitud = SolicitudVenta::findOrFail($validated['solicitudVenta']);
                $solicitud->update([
                    'estado' => 'Aceptada',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $solicitud = SolicitudVenta::create([
                    'origen_id' => 1, // AJUSTAR según tu lógica
                    'descripcion' => 'Solicitud generada automáticamente',
                    'estado' => 'Aceptada',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                ]);
            }
            // 2) Orden de compra
            if (!empty($validated['ordenCotizacion'])) {
                $orden = ordenCotizacionVenta::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'cliente_id'            => $cliente->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                    'estado'                => 'Confirmada',
                ]);
            } else {
                $orden = ordenCotizacionVenta::create([
                    'cliente_id'            => $cliente->id,
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
            // 🔗 Vincular con solicitud si aplica
            if (!empty($validated['solicitudVenta'])) {
                SolicitudVentaOrdenCotizacionVenta::firstOrCreate([
                    'solicitud_venta_id'    => $validated['solicitudVenta'],
                    'orden_cotizaciones_ventas_id'  => $orden->id,
                ]);
            }

            // 4) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                if (!empty($producto['id'])) {
                    // 🔄 Actualiza detalle existente
                    $detalle = ordenCotizacionVentaDetalle::where('id', $producto['id'])
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
                    $detalle = ordenCotizacionVentaDetalle::create([
                        'orden_cotizaciones_ventas_id' => $orden->id,
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

                    // pivot impuestos — usar array vacío si no vino nada
                    $impuestos = $producto['impuestos_seleccionados'] ?? [];
                    $detalle->impuestos()->sync(is_array($impuestos) ? $impuestos : []);

                    $productosIds[] = $detalle->id;
            }

                    // 🔴 Borrar los detalles que ya no están en el request — con pivot detach
                    $detallesEliminar = $orden->detalles()
                        ->whereNotIn('id', $productosIds)
                        ->get();

                    foreach ($detallesEliminar as $detalle) {
                        $detalle->impuestos()->detach();
                        $detalle->delete();
                    }

                    DB::commit();



                    return redirect()->route('cotizacionesOrdenesVenta.show', [
                        'solicitud_id' => $validated['solicitudVenta'],
                        'orden_id' => $orden->id
                    ])->with('success');

                } catch (\Exception $e) {
                    DB::rollBack();

                    return redirect()->back()->with('danger', 'Error: ' . $e->getMessage());
                    dd($e->getMessage(), $e->getLine(), $e->getFile());
                }
            }

    ////VISUALIZAR DETALLE DE COTIZACION
    public function show($solicitud_id, $orden_id = null)
    {
        $solicitudVentaQuery = SolicitudVenta::with(['origen']);

        if ($orden_id) {
            $solicitudVentaQuery->with([
                'ordenesCotizacion' => function ($q) use ($orden_id) {
                    $q->where('orden_cotizaciones.id', $orden_id);
                },
                'ordenCotizacionVenta.cliente',
                'ordenCotizacionVenta.tipoMoneda',
                'ordenCotizacionVenta.detalles',
                'ordenCotizacionVenta.almacenDestino',
                'ordenCotizacionVenta.almacen',
                'ordenCotizacionVenta.detalles.detallesImpuesto',
                'ordenCotizacionVenta.detalles.producto',
                'ordenCotizacionVenta.detalles.producto.modelo',
                'ordenCotizacionVenta.detalles.producto.subCategoria',
                'ordenCotizacionVenta.ordenesCompra',
                'ordenCotizacionVenta.archivos',
            ]);
        }

        $solicitudVentaQuery->where('solicitud_ventas.id', $solicitud_id);
        $solicitudVenta = $solicitudVentaQuery->firstOrFail();

        return Inertia::render('Ventas/CotizacionesOrdenes/NuevaCotizacion/Index', [
            'solicitudVentaElegida' => $solicitudVenta,
            'impuestos' => Impuesto::all(),
            'clientes' => [
                'data' => Cliente::with('padron')->get()
            ],
            'almacenDestino' => Almacen::all(),
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    ////RECHAZAR COTIZACION
    public function rechazarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudVenta = SolicitudVenta::findOrFail($solicitud_id);
        $solicitudVenta->estado = 'Rechazada';
        $solicitudVenta->save();

        return redirect()->back()->with('success', 'Solicitud rechazada.');
    }

    ////FINALIZAR COTIZACION
    public function finalizarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudVenta = SolicitudVenta::findOrFail($solicitud_id);
        $solicitudVenta->estado = 'Finalizada';
        $solicitudVenta->save();

        return redirect()->back()->with('success', 'Solicitud finalizada.');
    }

    ////ACEPTAR COTIZACION
    public function aceptarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudVenta = SolicitudVenta::findOrFail($solicitud_id);
        $solicitudVenta->estado = 'Aceptada';
        $solicitudVenta->save();


        return redirect()->back()->with('success', 'Solicitud aceptada.');
    }

    ////GENERAR ORDEN DE VENTA
    public function generarOrdenVenta(Request $request)
    {
        $validated = $request->validate([
            'ordenes' => 'required|array',
            'ordenes.*' => 'integer',
            'usuario_id' => 'required|integer',
        ]);

        $ordenesCotizacionIds = $validated['ordenes'];

        if (empty($ordenesCotizacionIds)) {
            return back()->with('error', 'No se seleccionaron órdenes para generar la orden de venta.');
        }

        $ordenesCotizacion = ordenCotizacionVenta::whereIn('id', $ordenesCotizacionIds)->with('detalles')->get();

        if ($ordenesCotizacion->isEmpty()) {
            return back()->with('error', 'No se encontraron órdenes de cotización.');
        }

        DB::beginTransaction();

        try {
            foreach ($ordenesCotizacion as $oc) {
                // Crear la orden de venta individual para cada orden de cotización
                $ordenVenta = OrdenVenta::create([
                    'cliente_id' => $oc->cliente_id,
                    'moneda_id' => $oc->moneda_id,
                    'entrega_esperada' => $oc->entrega_esperada,
                    'almacen_destino_id' => $oc->almacen_destino_id,
                    'observacion' => $oc->observacion,
                    'estado' => 'Pendiente',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => $validated['usuario_id'],
                    'fecha_actualizacion' => null,
                ]);

                // Relacionar la orden de venta con la orden de cotización
                $ordenVenta->ordenesCotizacion()->attach($oc->id);

                // Copiar los detalles
                foreach ($oc->detalles as $detalle) {

                    // Crear el detalle de Orden de Venta
                    $detalleOV = OrdenVentaDetalle::create([
                        'orden_ventas_id' => $ordenVenta->id,
                        'orden_cotizaciones_id' => $oc->id,
                        'entrega_esperada' => $detalle->entrega_esperada,
                        'producto_id' => $detalle->producto_id,
                        'descripcion' => $detalle->descripcion ?? '',
                        'cantidad' => $detalle->cantidad,
                        'precio_unitario' => $detalle->precio_unitario,
                        'porcentaje_descuento' => $detalle->porcentaje_descuento,
                        'importe' => $detalle->importe,
                        'usuario_creacion' => $validated['usuario_id'],
                        'created_at' => now(),
                    ]);

                    // ============================================
                    // COPIAR IMPUESTOS DEL DETALLE
                    // ============================================
                    if ($detalle->detallesImpuesto && $detalle->detallesImpuesto->count() > 0) {

                        foreach ($detalle->detallesImpuesto as $impPivot) {

                            OrdenVentaDetalleImpuesto::create([
                                'orden_ventas_detalles_id' => $detalleOV->id,
                                'impuesto_id' => $impPivot->impuesto_id,
                            ]);

                        }
                    }
                }
            }


            DB::commit();

            return back()->with('success');

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
            'solicitudVenta' => 'nullable|numeric',
            'ordenCotizacionVenta' => 'nullable|numeric',
            'cliente' => 'required|string',
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
            'productos.*.impuestos_seleccionados' => 'sometimes|array|exists:impuestos,id',
        ]);

        $cliente = Cliente::where('nombre_fantasia', $validated['cliente'])->firstOrFail();

        DB::beginTransaction();

        try {
            // 1) Orden de venta
            if (!empty($validated['ordenCotizacionVenta'])) {
                $orden = ordenCotizacionVenta::findOrFail($validated['ordenCotizacionVenta']);
                $orden->update([
                    'cliente_id'            => $cliente->id,
                    'moneda_id'             => $validated['moneda'],
                    'cotizar_antes_de'      => $validated['cotizar_antes_de'],
                    'entrega_esperada'      => $validated['entrega_esperada'],
                    'almacen_destino_id'    => $validated['almacen'],
                    'observaciones'         => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);
            } else {
                $orden = ordenCotizacionVenta::create([
                    'cliente_id'            => $cliente->id,
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

            // 🔗 Vincular con solicitud si aplica
            if (!empty($validated['solicitudVenta'])) {
                SolicitudVentaOrdenCotizacionVenta::firstOrCreate([
                    'solicitud_venta_id'    => $validated['solicitudVenta'],
                    'orden_cotizaciones_venta_id'  => $orden->id,
                ]);
            }


            // 2) Detalles
            $productosIds = [];

            foreach ($validated['productos'] as $producto) {
                // Intento de encontrar detalle por id (si viene)
                $detalle = null;

                if (!empty($producto['id'])) {
                    $detalle = ordenCotizacionVentaDetalle::where('id', $producto['id'])
                        ->where('orden_cotizaciones_venta_id', $orden->id)
                        ->first();
                }

                // Si existe lo actualizo, si no existe lo creo
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
                } else {
                    $detalle = ordenCotizacionVentaDetalle::create([
                        'orden_cotizaciones_venta_id' => $orden->id,
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

                // pivot impuestos — usar array vacío si no vino nada
                $impuestos = $producto['impuestos_seleccionados'] ?? [];
                $detalle->impuestos()->sync(is_array($impuestos) ? $impuestos : []);

                $productosIds[] = $detalle->id;
            }

            // 🔴 Borrar los detalles que ya no están en el request — con pivot detach
            $detallesEliminar = $orden->detalles()
                ->whereNotIn('id', $productosIds)
                ->get();

            foreach ($detallesEliminar as $detalle) {
                $detalle->impuestos()->detach();
                $detalle->delete();
            }

            DB::commit();



            return redirect()->route('cotizacionesOrdenesVentas.show', [
                'solicitud_id' => $validated['solicitudVenta'],
                'orden_id' => $orden->id
            ])->with('success',' Cotización creada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('danger', 'Error: ' . $e->getMessage());
            dd($e->getMessage(), $e->getLine(), $e->getFile());
        }
    }

    ////SUBIR ARCHIVO A COTIZACION
    public function subirArchivo(Request $request, $id)
    {
        $request->validate([
            'archivo' => 'required|file|max:10240',
        ]);

        $orden = ordenCotizacionVenta::findOrFail($id);

        $file = $request->file('archivo');
        $path = $file->store('cotizaciones_ordenes_ventas');

        $orden->archivos()->create([
            'nombre' => $file->getClientOriginalName(),
            'path'   => $path,
            'mime'   => $file->getMimeType(),
            'size'   => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    ////ELIMINAR ARCHIVO DE COTIZACION
    public function eliminarArchivo(ordenCotizacionVentaArchivo $archivo)
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
    public function visualizarArchivo(ordenCotizacionVentaArchivo $archivo)
    {

    $path = storage_path('app/private/' . ltrim($archivo->path, '/'));


    if (!file_exists($path)) {
        abort(404, 'Archivo no encontrado: ' . $path);
    }

    return response()->file($path);
    }

}
