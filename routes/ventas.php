<?php

use App\Http\Controllers\Ventas\Clientes\ClientesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Ventas\OrdenCotizacionesVentas\OrdenCotizacionesVentasController;
use App\Http\Controllers\Ventas\ComprobantesClientes\ComprobantesClientesController;
use App\Http\Controllers\Ventas\OrdenCobroController;
use App\Http\Controllers\Ventas\OrdenVentas\OrdenVentasController;

Route::middleware('module:ventas')->group(function () {
    Route::get('/ventas', function () {
        return Inertia::render('Ventas/Index', [
            'modulo' => 'ventas',
        ]);
    })->name('ventas');

    // Grupo para el módulo de ventas
// Rutas para proveedores
Route::middleware(['menu:ordenesVentas'])->group(function () {

    Route::middleware(['submenu:clientesVentas'])
        ->group(function () {
            // Vista principal
            Route::get('ventas/clientes', [ClientesController::class, 'index'])
                ->name('clientesVentas');

            // Ruta para actualización
            Route::middleware('submenu_permission:update clientesVentas')->group(function () {
                Route::put('clientes/{cliente}', [ClientesController::class, 'update'])
                    ->name('clientes.update');
            });
        });

    Route::middleware(['submenu:cotizacionesVentas'])->prefix('ventas/cotizaciones-ordenes')->group(function () {

        Route::get('/archivo/{archivo}', [OrdenCotizacionesVentasController::class, 'visualizarArchivo'])
        ->name('cotizacionesVentas.visualizarArchivo')
        ->middleware('auth'); // protege el archivo
        // Listado
        Route::get('/', [OrdenCotizacionesVentasController::class, 'index'])
            ->name('cotizacionesVentas');

        // Formulario para crear
        Route::get('/nueva', [OrdenCotizacionesVentasController::class, 'nuevaCotizacion'])
            ->name('cotizacionesVentas.nueva');

        // Guardar cotización
        Route::post('/', [OrdenCotizacionesVentasController::class, 'enviarCotizacion'])
            ->name('cotizacionesVentas.store');

       // Confirmar cotización
        Route::post('/confirmar', [OrdenCotizacionesVentasController::class, 'confirmarCotizacion'])
            ->name('cotizacionesVentas.confirmarCotizacion');

        // Mostrar detalle
        Route::get('/{solicitud_id}/{orden_id?}', [OrdenCotizacionesVentasController::class, 'show'])
            ->name('cotizacionesVentas.show');

        ///Rechazar Solicitud de venta
        Route::post('/rechazar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesVentasController::class, 'rechazarSolicitud'])
            ->name('cotizacionesVentas.rechazarSolicitud');

        ///Finalizar Solicitud de venta
        Route::post('/finalizar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesVentasController::class, 'finalizarSolicitud'])
            ->name('cotizacionesVentas.finalizarSolicitud');

        ///Aceptar Solicitud de venta
        Route::post('/aceptar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesVentasController::class, 'aceptarSolicitud'])
            ->name('cotizacionesVentas.aceptarSolicitud');

        ///Generar Orden de venta
        Route::post('/generar-orden-venta', [OrdenCotizacionesVentasController::class, 'generarOrdenVenta'])
            ->name('cotizacionesVentas.generarOrdenVenta');

        // Guardar
        Route::post('/guardar', [OrdenCotizacionesVentasController::class, 'guardar'])
            ->name('cotizacionesVentas.guardar');


        //SUBE ARCHIVO
        Route::post('{orden}/archivo', [OrdenCotizacionesVentasController::class, 'subirArchivo'])
        ->name('cotizacionesVentas.subirArchivo');

        Route::post('/archivo/{archivo}/eliminar', [OrdenCotizacionesVentasController::class, 'eliminarArchivo'])
        ->name('cotizacionesVentas.eliminar');

    });



    Route::middleware(['submenu:ordenesVentas'])->prefix('ventas/ordenes-ventas')->group(function () {
        // Listado
        Route::get('/', [OrdenVentasController::class, 'index'])
            ->name('ordenesVentas');

        // Formulario para crear
        Route::get('/nueva', [OrdenVentasController::class, 'nuevaOrdenVenta'])
            ->name('ordenesVentas.nueva');

        // Guardar orden de venta
        Route::post('/confirmar', [OrdenVentasController::class, 'confirmarOrdenVenta'])
            ->name('ordenesVentas.confirmarOrdenVenta');

        // Mostrar detalle
        Route::get('/{orden_venta_id}', [OrdenVentasController::class, 'show'])
            ->name('ordenesVentas.show');

        // Guardar
        Route::post('/guardar', [OrdenVentasController::class, 'guardar'])
            ->name('ordenesVentas.guardar');

        // Cancelar
        Route::post('/cancelar', [OrdenVentasController::class, 'cancelar'])
            ->name('ordenesVentas.cancelar');

        //SUBE ARCHIVO
        Route::post('{orden}/archivo', [OrdenVentasController::class, 'subirArchivo'])
        ->name('ordenesVentas.subirArchivo');

        Route::post('/archivo/{archivo}/eliminar', [OrdenVentasController::class, 'eliminarArchivo'])
        ->name('ordenesVentas.eliminar');

        Route::get('/archivo/{archivo}', [OrdenVentasController::class, 'visualizarArchivo'])
        ->name('ordenesVentas.visualizarArchivo')
        ->middleware('auth'); // protege el archivo


        //SUBE ARCHIVO FACTURA
        Route::post('{orden}/archivoFactura', [OrdenVentasController::class, 'subirArchivoFactura'])
        ->name('ordenesVentas.subirArchivoFactura');

        Route::post('/archivoFactura/{archivo}/eliminarFactura', [OrdenVentasController::class, 'eliminarArchivoFactura'])
        ->name('ordenesVentas.eliminarFactura');

        Route::get('/archivoFactura/{archivo}', [OrdenVentasController::class, 'visualizarArchivoFactura'])
        ->name('ordenesVentas.visualizarArchivoFactura')
        ->middleware('auth'); // protege el archivo

    //Rutas para ordenes de pago
        // Listado
       /* Route::get('/', [OrdenPagoController::class, 'index'])
            ->name('ordenesPagosCompras');*/

        // Formulario para crear
       /* Route::get('/nueva', [OrdenPagoController::class, 'nuevaOrdenPago'])
            ->name('ordenesPagosCompras.nueva');*/

        // Guardar orden de pago
        Route::post('/ordenes-cobros', [OrdenCobroController::class, 'store'])
            ->name('ordenesCobrosVentas.store');
        // Guardar comprobantes de clientes
        Route::post('/comprobantes-clientes', [ComprobantesClientesController::class, 'store'])
            ->name('comprobantesClientes.store');
        // Comprobantes por orden
        Route::get('/{ordenId}/comprobantes', [ComprobantesClientesController::class, 'comprobantesPorOrden']);

        Route::get('/comprobantes-clientes/proximo-numero-anticipo', [ComprobantesClientesController::class, 'getProximoNumeroAnticipo'])
        ->name('comprobantes-clientes.proximo-numero-anticipo');

        // Mostrar detalle
       /* Route::get('/{orden_pago_id}', [OrdenPagoController::class, 'show'])
            ->name('ordenesPagosCompras.show');*/
    });

        Route::middleware(['submenu:facturasClientes'])
        ->group(function () {
            // Vista principal
            Route::get('ventas/comprobantes-clientes', [ComprobantesClientesController::class, 'index'])
                ->name('facturasClientes');



        });
});



});
