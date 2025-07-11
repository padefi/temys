<?php

use App\Http\Controllers\Almacenes\AlmacenController;
use App\Http\Controllers\ControlAcceso\ProfileController;
use App\Http\Controllers\Inventario\SolicitudStockController;
use App\Http\Controllers\inventario\StockController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use App\Models\ControlAcceso\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'active', 'route_user_active'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');;

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy')->middleware('can:avoid,' . User::class);

    /* TO-DO Modulo control accesos */
    require __DIR__.'/control-acceso.php';    

    /* TO-DO Panel de usuarios de todos los modulos */
    require __DIR__.'/user-module-panel.php';    

    /* TO-DO Modulo afiliados */
    Route::middleware('module:afiliados')->group(function () {
        Route::get('/afiliados', function () {
            return Inertia::render('ControlAcceso/Index', [
                'modulo' => 'afiliados',
            ]);
        })->name('afiliados');

        Route::middleware(['menu:configuracionAfiliados'])->group(function () {
            Route::middleware(['submenu:usuariosAfiliados', 'role_module:encargado afiliados'])->group(function () {
                Route::middleware('submenu_permission:read usuariosAfiliados')->group(function () {
                    Route::get('afiliados/usuarios', [UserModuleController::class, 'index'])->name('usuariosAfiliados');
                });
            });
        });
    });

    /* TO-DO Modulo compras */
    Route::middleware('module:compras')->group(function () {
        Route::get('/compras', function () {
            return Inertia::render('Inventario/Index', [
                'modulo' => 'compras',
            ]);
        })->name('compras');

        Route::middleware(['menu:configuracionCompras'])->group(function () {
            Route::middleware(['submenu:usuariosCompras', 'role_module:encargado compras'])->group(function () {
                Route::middleware('submenu_permission:read usuariosCompras')->group(function () {
                    Route::get('compras/usuarios', [UserModuleController::class, 'index'])->name('usuariosCompras');
                });
            });
        });
    });

    /* TO-DO Modulo contabilidad */
    Route::middleware('module:contabilidad')->group(function () {
        Route::get('/contabilidad', function () {
            return Inertia::render('Contabilidad/Index', [
                'modulo' => 'contabilidad',
            ]);
        })->name('contabilidad');

        Route::middleware(['menu:configuracionContabilidad'])->group(function () {
            Route::middleware(['submenu:usuariosContabilidad', 'role_module:encargado contabilidad'])->group(function () {
                Route::middleware('submenu_permission:read usuariosContabilidad')->group(function () {
                    Route::get('contabilidad/usuarios', [UserModuleController::class, 'index'])->name('usuariosContabilidad');
                });
            });
        });
    });

    /* TO-DO Modulo inventario */
    Route::middleware('module:inventario')->group(function () {
        Route::get('/inventario', function () {
            return Inertia::render('Contabilidad/Index', [
                'modulo' => 'inventario',
            ]);
        })->name('inventario');

        Route::middleware(['menu:configuracionInventario'])->group(function () {
            Route::middleware(['submenu:usuariosInventario', 'role_module:encargado inventario'])->group(function () {
                Route::middleware('submenu_permission:read usuariosInventario')->group(function () {
                    Route::get('inventario/usuarios', [UserModuleController::class, 'index'])->name('usuariosInventario');
                    Route::get('inventario/inventarioFisico', [StockController::class, 'index'])->name('inventarioFisico');
                    Route::get('/inventario/almacenes', [AlmacenController::class, 'index']); // No estoy segura de que se declare aca
                    Route::post('/solicitar-stock', [SolicitudStockController::class, 'solicitarStock']);
                    Route::get('/solicitudes-stock', [SolicitudStockController::class, 'getSolicitudesAll'])->name('inventario.solicitudes.all');
                    Route::get('/solicitudes-stock/{id}', [SolicitudStockController::class, 'getSolicitudDetalle'])->name('inventario.solicitudes.detalle');
                    Route::post('/solicitudes-stock-aceptar', [SolicitudStockController::class, 'aceptarSolicitud']);
                    Route::post('/solicitudes-stock-cancelar', [SolicitudStockController::class, 'cancelarSolicitud']);
                    Route::get('/solicitudes-stock-aceptadas', [SolicitudStockController::class, 'solicitudesAceptadas'])->name('inventario.misSolicitudes');

                  
                });
            });
        }); 
    });

    /* TO-DO Modulo seccionales */
    Route::middleware('module:seccionales')->group(function () {
        Route::get('/seccionales', function () {
            return Inertia::render('Seccionales/Index', [
                'modulo' => 'seccionales',
            ]);
        })->name('seccionales');

        Route::middleware(['menu:configuracionSeccionales'])->group(function () {
            Route::middleware(['submenu:usuariosSeccionales', 'role_module:encargado seccionales'])->group(function () {
                Route::middleware('submenu_permission:read usuariosSeccionales')->group(function () {
                    Route::get('seccionales/usuarios', [UserModuleController::class, 'index'])->name('usuariosSeccionales');
                });
            });
        });
    });

    /* TO-DO Modulo ventas */
    Route::middleware('module:ventas')->group(function () {
        Route::get('/ventas', function () {
            return Inertia::render('Ventas/Index', [
                'modulo' => 'ventas',
            ]);
        })->name('ventas');

        Route::middleware(['menu:configuracionVentas'])->group(function () {
            Route::middleware(['submenu:usuariosVentas', 'role_module:encargado ventas'])->group(function () {
                Route::middleware('submenu_permission:read usuariosVentas')->group(function () {
                    Route::get('ventas/usuarios', [UserModuleController::class, 'index'])->name('usuariosVentas');
                });
            });
        });
    });

    /* TO-DO Modulo patrimonio */
    Route::middleware('module:patrimonio')->group(function () {
        Route::get('/patrimonio', function () {
            return Inertia::render('Patrimonio/Index', [
                'modulo' => 'patrimonio',
            ]);
        })->name('patrimonio');

        Route::middleware(['menu:configuracionPatrimonio'])->group(function () {
            Route::middleware(['submenu:usuariosPatrimonio', 'role_module:encargado patrimonio'])->group(function () {
                Route::middleware('submenu_permission:read usuariosPatrimonio')->group(function () {
                    Route::get('patrimonio/usuarios', [UserModuleController::class, 'index'])->name('usuariosPatrimonio');
                });
            });
        });
    });
});

require __DIR__ . '/auth.php';
