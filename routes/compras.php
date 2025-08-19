<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
use App\Http\Controllers\Compras\OrdenCotizaciones\OrdenCotizacionesController;
use App\Http\Controllers\Compras\OrdenCompras\OrdenComprasController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/compras', function () {
    return Inertia::render('Compras/Index', [
       'modulo' => 'compras',
    ]);
})->name('compras');

// Grupo para el módulo de compras
Route::middleware(['menu:configuracionCompras'])->group(function () {
    // Ruta para usuarios
    Route::middleware(['submenu:usuariosCompras', 'role_module:encargado compras'])
         ->group(function () {
             Route::middleware('submenu_permission:read usuariosCompras')
                  ->get('compras/usuarios', [UserModuleController::class, 'index'])
                  ->name('usuariosCompras');
         });
});

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

    Route::middleware(['submenu:cotizacionesOrdenesCompras'])->prefix('cotizaciones-ordenes')->group(function () {

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

    });


    Route::middleware(['submenu:ordenesCompras'])->prefix('ordenes-compras')->group(function () {
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
    });

});
