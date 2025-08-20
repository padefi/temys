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
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;
use App\Models\Compras\SolicitudCompra;
use Illuminate\Support\Facades\DB;
use App\Models\Inventario\Productos\Producto;
use Inertia\Inertia;

use function Laravel\Prompts\alert;
use Illuminate\Support\Facades\Log;

class OrdenCotizacionesController extends Controller
{
    public function index(Request $request)
    {

        $solicitudesComprasListado = SolicitudCompra::with([
            'ordenesCotizacion',
            'ordenesCotizacion.proveedor',
            'ordenesCotizacion.tipoMoneda',
            'origen',
            'ordenesCotizacion.ordenesCompra',
            'ordenesCotizacion.almacen'
        ])->get();



        return Inertia::render('Compras/CotizacionesOrdenes/Index', [
            'solicitudesComprasListado' => $solicitudesComprasListado,
            //'module' => '3',
        ]);

    }

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

    ////////////Enviar Cotizacion
    public function enviarCotizacion(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|string',
            'cotizar_antes_de' => 'required|date',
            'entrega_esperada' => 'required|date',
            'entregar_a' => 'required|string',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.descripcion' => 'required|string',
            'productos.*.codigo_barras' => 'nullable|string',
            'productos.*.referencia' => 'nullable|string',
            'productos.*.cantidad' => 'required|numeric|min:1',
            'productos.*.precio_unitario' => 'nullable|numeric',
            'productos.*.porcentaje_descuento' => 'nullable|numeric',
            'productos.*.importe' => 'nullable|numeric',
        ]);

        $proveedor = Proveedor::where('nombre_fantasia', $validated['proveedor'])->firstOrFail();
        $moneda = TipoMoneda::where('descripcion', $validated['moneda'])->firstOrFail();

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

            // 🔵 2) Orden
            if (!empty($validated['ordenCotizacion'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $moneda->id,
                    'cotizar_antes_de' => $validated['cotizar_antes_de'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'entregar_a' => $validated['entregar_a'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);

                $orden->detalles()->delete();
            } else {
                $orden = OrdenCotizacion::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $moneda->id,
                    'cotizar_antes_de' => $validated['cotizar_antes_de'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'entregar_a' => $validated['entregar_a'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado' => 'Pendiente',
                ]);
            }

            // 🔵 3) Vincular
            if (!$orden->solicitudCompra()->where('solicitud_compras.id', $solicitud->id)->exists()) {
                $orden->solicitudCompra()->attach($solicitud->id);
            }

            // 🔵 4) Detalles
            foreach ($validated['productos'] as $producto) {
                OrdenCotizacionDetalle::create([
                    'orden_cotizaciones_id' => $orden->id,
                    'producto_id' => $producto['producto_id'],
                    'descripcion' => $producto['descripcion'] ?? '',
                    'codigo_barras' => $producto['codigo_barras'] ?? '',
                    'referencia' => $producto['referencia'] ?? '',
                    'cantidad' => $producto['cantidad'],
                    'precio_unitario' => $producto['precio_unitario'] ?? 0,
                    'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                    'importe' => $producto['importe'] ?? 0,
                    'usuario_id' => $validated['usuario_id'],
                ]);
            }

            DB::commit();



        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error interno: ' . $e->getMessage(),
            ], 500);
        }
    }


    ////////////Confirmar Cotizacion
    public function confirmarCotizacion(Request $request)
    {
        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|string',
            'cotizar_antes_de' => 'required|date',
            'entrega_esperada' => 'required|date',
            'entregar_a' => 'required|string',
            'observaciones' => 'nullable|string',
            'usuario_id' => 'required|numeric',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.descripcion' => 'required|string',
            'productos.*.codigo_barras' => 'nullable|string',
            'productos.*.referencia' => 'nullable|string',
            'productos.*.cantidad' => 'required|numeric|min:1',
            'productos.*.precio_unitario' => 'nullable|numeric',
            'productos.*.porcentaje_descuento' => 'nullable|numeric',
            'productos.*.importe' => 'nullable|numeric',
        ]);

        $proveedor = Proveedor::where('nombre_fantasia', $validated['proveedor'])->firstOrFail();
        $moneda = TipoMoneda::where('descripcion', $validated['moneda'])->firstOrFail();

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

            // 🔵 2) Orden
            if (!empty($validated['ordenCotizacion'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCotizacion']);
                $orden->update([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $moneda->id,
                    'cotizar_antes_de' => $validated['cotizar_antes_de'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'entregar_a' => $validated['entregar_a'],
                    'estado' => 'Confirmada',
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);

                $orden->detalles()->delete();
            } else {
                $orden = OrdenCotizacion::create([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $moneda->id,
                    'cotizar_antes_de' => $validated['cotizar_antes_de'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'entregar_a' => $validated['entregar_a'],
                    'estado' => 'Confirmada',
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_id' => $validated['usuario_id'],
                    'usuario_actualizacion' => null,
                    'estado' => 'Pendiente',
                ]);
            }

            // 🔵 3) Vincular
            if (!$orden->solicitudCompra()->where('solicitud_compras.id', $solicitud->id)->exists()) {
                $orden->solicitudCompra()->attach($solicitud->id);
            }

            // 🔵 4) Detalles
            foreach ($validated['productos'] as $producto) {
                OrdenCotizacionDetalle::create([
                    'orden_cotizaciones_id' => $orden->id,
                    'producto_id' => $producto['producto_id'],
                    'descripcion' => $producto['descripcion'] ?? '',
                    'codigo_barras' => $producto['codigo_barras'] ?? '',
                    'referencia' => $producto['referencia'] ?? '',
                    'cantidad' => $producto['cantidad'],
                    'precio_unitario' => $producto['precio_unitario'] ?? 0,
                    'porcentaje_descuento' => $producto['porcentaje_descuento'] ?? 0,
                    'importe' => $producto['importe'] ?? 0,
                    'usuario_id' => $validated['usuario_id'],
                ]);
            }

            DB::commit();



        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error interno: ' . $e->getMessage(),
            ], 500);
        }
    }




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
                'ordenesCotizacion.almacen',
                'ordenesCotizacion.detalles.producto',
                'ordenesCotizacion.detalles.producto.modelo',
                'ordenesCotizacion.detalles.producto.subCategoria',
                'ordenesCotizacion.ordenesCompra',
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
            'almacen' => Almacen::all(),
            'tipoMonedas' => TipoMoneda::all(),
            'productos' => Producto::with('modelo', 'subCategoria')->get(),
        ]);
    }

    public function rechazarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudCompra = SolicitudCompra::findOrFail($solicitud_id);
        $solicitudCompra->estado = 'Rechazada';
        $solicitudCompra->save();

        return redirect()->back()->with('success', 'Solicitud rechazada.');
    }

    public function aceptarSolicitud($solicitud_id, $orden_id = null)
    {
        $solicitudCompra = SolicitudCompra::findOrFail($solicitud_id);
        $solicitudCompra->estado = 'Aceptada';
        $solicitudCompra->save();


        return redirect()->back()->with('success', 'Solicitud aceptada.');
    }


    public function generarOrdenCompra(Request $request)
    {
        //dd($request->all());
        $validated = $request->validate([
            'ordenes' => 'required|array',
            'ordenes.*' => 'integer',
            'usuario_id' => 'required|integer',
        ]);

        $ordenesCotizacionIds = $validated['ordenes'];

        if (empty($ordenesCotizacionIds)) {
            return back()->with('error', 'No se seleccionaron órdenes para generar la orden de compra.');
        }

        // ⚡ 1. Traer las órdenes de cotización
        $ordenesCotizacion = OrdenCotizacion::whereIn('id', $ordenesCotizacionIds)->get();

        if ($ordenesCotizacion->isEmpty()) {
            return redirect()->back()->with('error', 'No se encontraron órdenes de cotización.');
        }

        // ⚡ 2. Validar que tengan el mismo proveedor (opcional, pero recomendado)
        $proveedorId = $ordenesCotizacion->first()->proveedor_id;
        $proveedorMismo = $ordenesCotizacion->every(fn ($oc) => $oc->proveedor_id === $proveedorId);

        if (!$proveedorMismo) {
            return redirect()->back()->with('error', 'Todas las órdenes deben ser del mismo proveedor.');
        }

        DB::beginTransaction();

        try {
            // ⚡ 3. Crear la orden de compra principal
            $ordenCompra = OrdenCompra::create([
                'proveedor_id' => $proveedorId,
                'almacen_destino_id' => null, // Usa el campo correcto según tu tabla
                'estado' => 'Enviada',
                'fecha_creacion' => now(),
                'usuario_creacion' => $validated['usuario_id'],
                'fecha_actualizacion' => null,
            ]);

            // ⚡ 4. Relacionar con las órdenes de cotización
            $ordenCompra->ordenesCotizacion()->attach($ordenesCotizacionIds);


            // ⚡ 5. Insertar los detalles desde cada orden de cotización
            foreach ($ordenesCotizacion as $ordenCotizacion) {
                foreach ($ordenCotizacion->detalles as $detalle) {
                    OrdenCompraDetalle::create([
                        'orden_compras_id' => $ordenCompra->id,
                        'orden_cotizaciones_id' => $ordenCotizacion->id,
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
            // ⚡ 6. Cambiar estado de la OC
                $ordenCotizacion->estado = 'Confirmada';
                $ordenCotizacion->save();
            }

            DB::commit();

            return back()->with('success', 'Orden de compra generada y vinculada correctamente.');

        } catch (\Exception $e) {
            Log::error('Error al generar orden de compra', ['error' => $e->getMessage()]);
            return back()->with('error', 'Error al generar la orden de compra: ' . $e->getMessage());
        }
    }

    ////////////Guardar
    public function guardar(Request $request)
    {

        $validated = $request->validate([
            'solicitudCompra' => 'nullable|numeric',
            'ordenCotizacion' => 'nullable|numeric',
            'proveedor' => 'required|string',
            'moneda' => 'required|string',
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
           /// 1)orden de compra
            if (!empty($validated['ordenCompra'])) {
                $orden = OrdenCotizacion::findOrFail($validated['ordenCompra']);
                $orden->update([
                    'proveedor_id' => $proveedor->id,
                    'moneda_id' => $validated['moneda'],
                    'entrega_esperada' => $validated['entrega_esperada'],
                    'almacen_destino_id' => $validated['almacen'],
                    'observaciones' => $validated['observaciones'] ?? '',
                    'usuario_actualizacion' => $validated['usuario_id'],
                ]);


            } else {
                $orden = OrdenCotizacion::create([
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
                $detalle = OrdenCotizacionDetalle::updateOrCreate(
                    [
                        // 🔑 Claves para identificar si ya existe
                        'orden_cotizaciones_id'   => $orden->id,
                        'producto_id'        => $producto['producto_id'],
                    ],
                    [
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

}
