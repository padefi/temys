<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
use App\Http\Controllers\Compras\OrdenCotizaciones\OrdenCotizacionesController;
use App\Http\Controllers\Compras\OrdenCompras\OrdenComprasController;
use App\Http\Controllers\Compras\OrdenPagoController;
use App\Http\Controllers\Compras\ComprobantesProveedores\ComprobantesProveedoresController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:compras')->group(function () {

Route::get('/compras', function () {
    return Inertia::render('Compras/Index', [
        'modulo' => 'compras',
    ]);
})->name('compras');

// Grupo para el módulo de compras
// Rutas para proveedores
Route::middleware(['menu:ordenesCompras'])->group(function () {

    Route::middleware(['submenu:proveedoresCompras'])
        ->group(function () {
            // Vista principal
            Route::get('compras/proveedores', [ProveedoresController::class, 'index'])
                ->name('proveedoresCompras');

            // Ruta para actualización
            Route::middleware('submenu_permission:update proveedoresCompras')->group(function () {
                Route::put('proveedores/{proveedor}', [ProveedoresController::class, 'update'])
                    ->name('proveedores.update');
            });
        });

    Route::middleware(['submenu:cotizacionesOrdenesCompras'])->prefix('compras/cotizaciones-ordenes')->group(function () {

        Route::get('/archivo/{archivo}', [OrdenCotizacionesController::class, 'visualizarArchivo'])
        ->name('cotizacionesOrdenes.visualizarArchivo')
        ->middleware('auth'); // protege el archivo
        // Listado
        Route::get('/', [OrdenCotizacionesController::class, 'index'])
            ->name('cotizacionesOrdenesCompras');

        // Formulario para crear
        Route::get('/nueva', [OrdenCotizacionesController::class, 'nuevaCotizacion'])
            ->name('cotizacionesCompras.nueva');

        // Guardar cotización
        Route::post('/', [OrdenCotizacionesController::class, 'enviarCotizacion'])
            ->name('cotizacionesOrdenes.store');

       // Confirmar cotización
        Route::post('/confirmar', [OrdenCotizacionesController::class, 'confirmarCotizacion'])
            ->name('cotizacionesOrdenes.confirmarCotizacion');

        // Mostrar detalle
        Route::get('/{solicitud_id}/{orden_id?}', [OrdenCotizacionesController::class, 'show'])
            ->name('cotizacionesOrdenes.show');

        ///Rechazar Solicitud de compra
        Route::post('/rechazar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesController::class, 'rechazarSolicitud'])
            ->name('cotizacionesOrdenes.rechazarSolicitud');

        ///Aceptar Solicitud de compra
        Route::post('/aceptar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesController::class, 'aceptarSolicitud'])
            ->name('cotizacionesOrdenes.aceptarSolicitud');

        ///Generar Orden de compra
        Route::post('/generar-orden-compra', [OrdenCotizacionesController::class, 'generarOrdenCompra'])
            ->name('cotizacionesOrdenes.generarOrdenCompra');

        // Guardar
        Route::post('/guardar', [OrdenCotizacionesController::class, 'guardar'])
            ->name('cotizacionesOrdenes.guardar');


        //SUBE ARCHIVO
        Route::post('{orden}/archivo', [OrdenCotizacionesController::class, 'subirArchivo'])
        ->name('cotizacionesOrdenes.subirArchivo');

        Route::post('/archivo/{archivo}/eliminar', [OrdenCotizacionesController::class, 'eliminarArchivo'])
        ->name('cotizacionesOrdenes.eliminar');

    });


    Route::middleware(['submenu:ordenesCompras'])->prefix('compras/ordenes-compras')->group(function () {
        // Listado
        Route::get('/', [OrdenComprasController::class, 'index'])
            ->name('ordenesCompras');

        // Formulario para crear
        Route::get('/nueva', [OrdenComprasController::class, 'nuevaOrdenCompra'])
            ->name('ordenesCompras.nueva');

        // Guardar orden de compra
        Route::post('/confirmar', [OrdenComprasController::class, 'confirmarOrdenCompra'])
            ->name('ordenesCompras.confirmarOrdenCompra');

        // Mostrar detalle
        Route::get('/{orden_compra_id}', [OrdenComprasController::class, 'show'])
            ->name('ordenesCompras.show');

        // Guardar
        Route::post('/guardar', [OrdenComprasController::class, 'guardar'])
            ->name('ordenesCompras.guardar');

        // Cancelar
        Route::post('/cancelar', [OrdenComprasController::class, 'cancelar'])
            ->name('ordenesCompras.cancelar');

        //SUBE ARCHIVO
        Route::post('{orden}/archivo', [OrdenComprasController::class, 'subirArchivo'])
        ->name('ordenesCompras.subirArchivo');

        Route::post('/archivo/{archivo}/eliminar', [OrdenComprasController::class, 'eliminarArchivo'])
        ->name('ordenesCompras.eliminar');

        Route::get('/archivo/{archivo}', [OrdenComprasController::class, 'visualizarArchivo'])
        ->name('ordenesCompras.visualizarArchivo')
        ->middleware('auth'); // protege el archivo



    //Rutas para ordenes de pago
        // Listado
       /* Route::get('/', [OrdenPagoController::class, 'index'])
            ->name('ordenesPagosCompras');*/

        // Formulario para crear
       /* Route::get('/nueva', [OrdenPagoController::class, 'nuevaOrdenPago'])
            ->name('ordenesPagosCompras.nueva');*/

        // Guardar orden de pago
        Route::post('/ordenes-pagos', [OrdenPagoController::class, 'store'])
            ->name('ordenesPagosCompras.store');
        // Guardar comprobantes de proveedores
        Route::post('/comprobantes-proveedores', [ComprobantesProveedoresController::class, 'store']);
        // Comprobantes por orden
        Route::get('/{ordenId}/comprobantes', [ComprobantesProveedoresController::class, 'comprobantesPorOrden']);


        // Mostrar detalle
       /* Route::get('/{orden_pago_id}', [OrdenPagoController::class, 'show'])
            ->name('ordenesPagosCompras.show');*/
    });



        Route::middleware(['submenu:facturasProveedores'])
        ->group(function () {
            // Vista principal
            Route::get('compras/comprobantes-proveedores', [ComprobantesProveedoresController::class, 'index'])
                ->name('facturasProveedores');



        });
});
});
