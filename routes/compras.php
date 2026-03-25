<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
use App\Http\Controllers\Compras\OrdenCotizaciones\OrdenCotizacionesController;
use App\Http\Controllers\Compras\OrdenCompras\OrdenComprasController;
use App\Http\Controllers\Compras\OrdenPagoController;
use App\Http\Controllers\Compras\OrdenTesoreriaController;

use App\Http\Controllers\Compras\ComprobantesProveedores\ComprobantesProveedoresController;



use App\Http\Controllers\Inventario\Productos\ProductoController;
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

            // Ruta para crear
            Route::middleware(['submenu_permission:create proveedoresCompras'])->group(function () {
                Route::post('proveedores', [ProveedoresController::class, 'store'])
                    ->name('proveedores.store');

                // Ruta para verificación en padrón
                Route::get('compras/proveedores/verificar-padron', [ProveedoresController::class, 'verifyPadron'])
                ->name('proveedores.verify-padron');    
            });

            // Ruta para actualización
            Route::middleware('submenu_permission:update proveedoresCompras')->group(function () {
                Route::put('proveedores/{proveedor}', [ProveedoresController::class, 'update'])
                    ->name('proveedores.update');
            });

            // Ruta para visualizar adjuntos requeridos
            Route::get('proveedores/adjuntos/{adjunto}', [ProveedoresController::class, 'showAdjunto'])
                ->name('proveedores.adjuntos.show');

            // Ruta para visualizar adjuntos opcionales
            Route::get('proveedores/adjuntos-opcionales/{adjunto}', [ProveedoresController::class, 'showAdjuntoOpcional'])
                ->name('proveedores.adjuntosOpcionales.show');    
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

        ///Finalizar Solicitud de compra
        Route::post('/finalizar-solicitud/{solicitud_id}/{orden_id?}', [OrdenCotizacionesController::class, 'finalizarSolicitud'])
            ->name('cotizacionesOrdenes.finalizarSolicitud');

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


        //SUBE ARCHIVO FACTURA
        Route::post('{orden}/archivoFactura', [OrdenComprasController::class, 'subirArchivoFactura'])
        ->name('ordenesCompras.subirArchivoFactura');

        Route::post('/archivoFactura/{archivo}/eliminarFactura', [OrdenComprasController::class, 'eliminarArchivoFactura'])
        ->name('ordenesCompras.eliminarFactura');

        Route::get('/archivoFactura/{archivo}', [OrdenComprasController::class, 'visualizarArchivoFactura'])
        ->name('ordenesCompras.visualizarArchivoFactura')
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

        Route::get('/comprobantes-proveedores/proximo-numero-anticipo', [ComprobantesProveedoresController::class, 'getProximoNumeroAnticipo'])
        ->name('comprobantes-proveedores.proximo-numero-anticipo');

        // Mostrar detalle
       /* Route::get('/{orden_pago_id}', [OrdenPagoController::class, 'show'])
            ->name('ordenesPagosCompras.show');*/
    });



        Route::middleware(['submenu:facturasProveedoresCompras'])
        ->group(function () {
            // Vista principal
            Route::get('compras/comprobantes-proveedores', [ComprobantesProveedoresController::class, 'index'])
                ->name('facturasProveedoresCompras');



        });
});

//////Productos Compras vista principal
 Route::middleware(['submenu:productosCompras'])->prefix('compras')

    ->group(function () {

        Route::get('productosCompras', [ProductoController::class, 'index'])
                ->name('productosCompras');

    });


//////Productos Compras
 Route::resource('compras/productos', ProductoController::class)
            ->names([
                'index' => 'productos.index',
                'create' => 'productos.create',
                'store' => 'productos.store',
                'edit' => 'productos.edit',
                'update' => 'productos.update',
                'destroy' => 'productos.destroy',
                'show' => 'productos.show',
            ]);



});
