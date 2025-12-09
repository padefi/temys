<?php
use App\Http\Controllers\Compras\OrdenPagoController;
use App\Http\Controllers\Contabilidad\ContabilidadController;
use App\Http\Controllers\Contabilidad\Asientos\AsientoController;
use App\Http\Controllers\Contabilidad\Asientos\PartidaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Contabilidad\Proveedores\ProveedoresController;

Route::middleware('module:contabilidad')->group(function () {
    Route::get('/contabilidad', function () {
        return Inertia::render('Contabilidad/Index', [
            'modulo' => 'contabilidad',
        ]);
    })->name('contabilidad');

    Route::middleware(['menu:proveedores'])->group(function () {
        Route::middleware(['submenu:facturasProveedores'])->prefix('contabilidad')->group(function () {
                /////vista principal
                Route::get('/facturasProveedores', function () {
                    return Inertia::render('Contabilidad/ComprobantesProveedores/Index');
                })->name('facturasProveedores');

                // Trae Proveedores con saldo
                Route::get('proveedoresListado', [ProveedoresController::class, 'proveedoresConSaldo']);
                Route::post('/ordenesPagos', [OrdenPagoController::class, 'store'])->name('ordenesPagos');
                Route::get('{proveedorId}/pendientes', [ProveedoresController::class, 'facturasPendientes']);
                Route::get('{proveedorId}/cuenta-corriente', [ProveedoresController::class, 'cuentaCorriente']);
                });

        Route::middleware(['submenu:pagosProveedores'])->prefix('contabilidad')->group(function () {
                    // Vista principal
                    Route::get('/pagosProveedores', [ProveedoresController::class, 'pagosProveedores'])->name('pagosProveedores');
                    // Guardar cambios
                    Route::post('ordenesPagos/guardarOrdenes', [OrdenPagoController::class, 'guardarOrdenes'])->name('guardarOrdenes');
                    // Procesar ordenes
                    Route::post('ordenesPagos/procesarOrdenes', [OrdenPagoController::class, 'procesarOrdenes'])->name('procesarOrdenes');
        });

        Route::middleware(['submenu:proveedores'])->group(function () {
                // Vista principal
                Route::get('Busquedaproveedores', [ProveedoresController::class, 'index'])->name('proveedoresCompras');
            });
    });

    Route::middleware(['menu:Contabilidad'])->group(function () {
        Route::middleware(['submenu:conciliar'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('/conciliar', [ContabilidadController::class, 'movimientosTesoreria'])->name('conciliar');
                // Conciliar movimientos
                Route::post('/movimientosTesoreria/conciliarMovimientos', [ContabilidadController::class, 'conciliarMovimientos'])->name('conciliarMovimientos');
            });
    });

    Route::middleware(['menu:operaciones'])->group(callback: function () {
        Route::middleware('submenu_permission:read asientosContables')->group(function () {
            Route::get('/contabilidad/asientos', [AsientoController::class, 'index'])->name('asientosContables');
            Route::get('/contabilidad/asiento/{asiento}', [PartidaController::class, 'show']);
        });
    });


    Route::middleware(['menu:reportesContabilidad'])->group(function () {
            //////LIBRO MAYOR
            Route::middleware(['submenu:libroMayor'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('/libroMayor', [ContabilidadController::class, 'libroMayor'])->name('libroMayor');

                // Listar Libro Mayor
                Route::get('/libroMayorListar', [ContabilidadController::class, 'libroMayorListar'])->name('libroMayorListar');

            });

            /////LIBRO DIARIO
            Route::middleware(['submenu:auditoriaDiario'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('/libroDiario', [ContabilidadController::class, 'libroDiario'])->name('auditoriaDiario');

                // Listar Libro Diario
                Route::get('/libroDiarioListar', [ContabilidadController::class, 'libroDiarioListar'])->name('libroDiarioListar');
            });

            //////LIBRO MAYOR POR EMPRESA
            Route::middleware(['submenu:libroMayorEmpresa'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('/libroMayorEmpresa', [ContabilidadController::class, 'libroMayorEmpresa'])->name('libroMayorEmpresa');

                // Listar Libro Mayor
                Route::get('/libroMayorEmpresaListar', [ContabilidadController::class, 'libroMayorEmpresaListar'])->name('libroMayorEmpresaListar');

            });

            //////BALANCE GENERAL
            Route::middleware(['submenu:balanceGeneral'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('/balanceGeneral', [ContabilidadController::class, 'balanceGeneral'])->name('balanceGeneral');

                // Listar Balance General
                Route::get('/balanceGeneralListar', [ContabilidadController::class, 'balanceGeneralListar'])->name('balanceGeneralListar');

            });
    });
});

