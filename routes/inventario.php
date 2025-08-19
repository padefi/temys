<?php

use App\Http\Controllers\Almacenes\AlmacenController;
use App\Http\Controllers\Inventario\Productos\ProductoController;
use App\Http\Controllers\Inventario\SolicitudStockController;
use App\Http\Controllers\Inventario\StockController;
use App\Http\Controllers\Inventario\EntregaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:inventario')->group(function () {
    Route::get('/inventario', function () {
        return Inertia::render('Inventario/Index', [
            'modulo' => 'inventario',
        ]);
    })->name('inventario');

    Route::middleware(['menu:operaciones'])->group(callback: function () {
        Route::middleware('submenu_permission:read entregas')->group(function () {
            Route::get('/inventario/entregas', [EntregaController::class, 'index'])->name('entregas');
        });

        Route::middleware('submenu_permission:read inventarioFisico')->group(function () {
            Route::get('inventario/inventarioFisico', [StockController::class, 'index'])->name('inventarioFisico');
            Route::get('/inventario/almacenes', [AlmacenController::class, 'index']);
            Route::post('/solicitar-stock', [SolicitudStockController::class, 'solicitarStock']);
            Route::get('/solicitudes-stock', [SolicitudStockController::class, 'getSolicitudesAll'])->name('inventario.solicitudes.all');
            Route::get('/solicitudes-stock/{id}', [SolicitudStockController::class, 'getSolicitudDetalle'])->name('inventario.solicitudes.detalle');
            Route::post('/solicitudes-stock-aceptar', [SolicitudStockController::class, 'aceptarSolicitud']);
            Route::post('/solicitudes-stock-cancelar', [SolicitudStockController::class, 'cancelarSolicitud']);
            Route::get('/solicitudes-stock-aceptadas', [SolicitudStockController::class, 'solicitudesAceptadas'])->name('inventario.misSolicitudes');
        });

        Route::middleware(['submenu:inventarioFisico'])->group(function () {
            Route::middleware('submenu_permission:read inventarioFisico')->group(function () {
                Route::get('/inventario/inventarioFisico', [StockController::class, 'index'])->name('inventarioFisico');
                Route::get('/stock-producto-almacen', [AlmacenController::class, 'obtenerStockProductos']);
                Route::get('/inventario/almacenes', [AlmacenController::class, 'index']);
                Route::get('/solicitudes-stock', [SolicitudStockController::class, 'getSolicitudesAll'])->name('inventario.solicitudes.all');
                Route::get('/solicitudes-stock/{id}', [SolicitudStockController::class, 'getSolicitudDetalle'])->name('inventario.solicitudes.detalle');
                Route::get('/solicitudes-stock-disponible/{idProducto}', [SolicitudStockController::class, 'stockDisponible']);
                Route::get('/solicitudes-stock-aceptadas', [SolicitudStockController::class, 'solicitudesAceptadas'])->name('inventario.misSolicitudes');
            });

            Route::middleware('submenu_permission:create inventarioFisico')->group(function () {
                Route::post('/solicitar-stock', [SolicitudStockController::class, 'solicitarStock']);
                Route::post('/solicitudes-stock-aceptar', [SolicitudStockController::class, 'aceptarSolicitud']);
                Route::post('/solicitudes-stock-cancelar', [SolicitudStockController::class, 'cancelarSolicitud']);
                Route::post('/solicitar-stock/multiple', [SolicitudStockController::class, 'solicitarStockMultiple']);
            });

            Route::middleware('submenu_permission:update inventarioFisico')->group(function () {
                Route::post('/actualizar-cantidad-contadas/{id}', [StockController::class, 'updateStock']);
                Route::post('/actualizar-cantidad-contadas-masivo', [StockController::class, 'actualizarMasivo']);
            });
        });
    });

    Route::middleware(['menu:configuracionInventario'])->group(function () {
        /* TO-DO Submenu ajustes */
        Route::middleware('menu_permission:read ajustesInventario')->group(function () {});
    });

    Route::middleware(['menu:productosInventario'])->group(function () {
        Route::middleware(['submenu:productosInventario'])->group(function () {
            Route::middleware('submenu_permission:read productosInventario')->group(function () {
                Route::get('inventario/productos', [ProductoController::class, 'index'])->name('productosInventario');
            });

            Route::middleware('submenu_permission:create productosInventario')->group(function () {
                Route::get('inventario/productos/crear', function () {
                    return Inertia::render('Inventario/Productos/crear');
                })->name('productosInventario.crear');

                Route::post('inventario/productos', [ProductoController::class, 'store'])->name('productosInventario.store');
            });

            Route::middleware('submenu_permission:update productosInventario')->group(function () {
                Route::put('inventario/productos/{producto}', [ProductoController::class, 'update'])->name('productosInventario.update');
            });
        });
    });
});
