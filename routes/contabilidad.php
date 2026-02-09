<?php

use App\Http\Controllers\Compras\ComprobantesProveedores\ComprobantesProveedoresController;
use App\Http\Controllers\Compras\OrdenPagoController;
use App\Http\Controllers\Contabilidad\ContabilidadController;
use App\Http\Controllers\Contabilidad\Asientos\AsientoController;
use App\Http\Controllers\Contabilidad\Asientos\PartidaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Contabilidad\Proveedores\ProveedoresController;
use App\Http\Controllers\Contabilidad\Clientes\ClientesController;
use App\Http\Controllers\Ventas\ComprobantesClientes\ComprobantesClientesController;
use App\Http\Controllers\Ventas\OrdenCobroController;

Route::middleware('module:contabilidad')->group(function () {
    Route::get('/contabilidad', function () {
        return Inertia::render('Contabilidad/Index', [
            'modulo' => 'contabilidad',
        ]);
    })->name('contabilidad');

    Route::middleware(['menu:proveedores'])->group(function () {

        ////////////COMPROBANTES PROVEEDORES
        Route::middleware(['submenu:facturasProveedores'])->prefix('contabilidad')->group(function () {
                /////vista principal
                Route::get('/facturasProveedores', function () {
                    return Inertia::render('Contabilidad/ComprobantesProveedores/Index');
                })->name('facturasProveedores');

                Route::get('{proveedorId}/anticipos-disponibles', [ComprobantesProveedoresController::class, 'anticiposDisponibles']);

                // Trae Proveedores con saldo
                Route::get('proveedoresListado', [ProveedoresController::class, 'proveedoresConSaldo']);
                Route::post('/ordenesTesoreriaProveedores', [OrdenPagoController::class, 'store'])->name('ordenesTesoreria');
                Route::get('{proveedorId}/pendientes', [ProveedoresController::class, 'facturasPendientes']);
                Route::get('{proveedorId}/cuenta-corriente', [ProveedoresController::class, 'cuentaCorriente']);

        });
        ///////////////PAGOS PROVEEDORES
        Route::middleware(['submenu:pagosProveedores'])->prefix('contabilidad')->group(function () {
                    // Vista principal
                    Route::get('/pagosProveedores', [ProveedoresController::class, 'pagosProveedores'])->name('pagosProveedores');
                    // Guardar cambios
                    Route::post('ordenesTesoreria/guardarOrdenes', [OrdenPagoController::class, 'guardarOrdenes'])->name('guardarOrdenes');
                    // Procesar ordenes
                    Route::post('ordenesTesoreria/procesarOrdenes', [OrdenPagoController::class, 'procesarOrdenes'])->name('procesarOrdenes');
        });
        ///////////////PROVEEDORES
        Route::middleware(['submenu:proveedores'])->group(function () {
                // Vista principal
                Route::get('Busquedaproveedores', [ProveedoresController::class, 'index'])->name('proveedoresCompras');
        });

        ////////REEMBOLSO
        Route::middleware(['submenu:reembolsos'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('reembolsos', [ProveedoresController::class, 'reembolsos'])->name('reembolsos');
                Route::get('/proveedores/{proveedorId}/facturas', [ProveedoresController::class, 'facturasTotales']);
                Route::get('/motivos-reembolso', [ContabilidadController::class, 'motivosReembolso']);
                Route::post('/reembolsos', [ContabilidadController::class, 'emitirReembolso']);
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


    Route::middleware(['menu:clientes'])->group(function () {


        ///////COMPROBANTES CLIENTES
        Route::middleware(['submenu:facturasClientes'])->prefix('contabilidad')->group(function () {
                /////vista principal
                Route::get('/facturasClientes', function () {
                    return Inertia::render('Contabilidad/ComprobantesClientes/Index');
                })->name('facturasClientes');

                Route::get('{clienteId}/anticipos-disponibles', [ComprobantesClientesController::class, 'anticiposDisponibles']);

                // Trae Clientes con saldo
                Route::get('clientesListado', [ClientesController::class, 'clientesConSaldo']);
                Route::post('/ordenesTesoreriaClientes', [OrdenCobroController::class, 'store'])->name('ordenesTesoreria');
                Route::get('/clientes/{clienteId}/pendientes', [ClientesController::class, 'facturasPendientes']);
                Route::get('/clientes/{clienteId}/cuenta-corriente', [ClientesController::class, 'cuentaCorriente']);

        });
        //////////CLIENTES/COBROS
        Route::middleware(['submenu:cobrosClientes'])->prefix('contabilidad')->group(function () {
                    // Vista principal
                    Route::get('/cobrosClientes', [ClientesController::class, 'cobrosClientes'])->name('cobrosClientes');
                    // Guardar cambios
                    Route::post('ordenesTesoreria/guardarOrdenes', [OrdenCobroController::class, 'guardarOrdenes'])->name('guardarOrdenes');
                    // Procesar ordenes
                    Route::post('ordenesTesoreria/procesarOrdenes', [OrdenCobroController::class, 'procesarOrdenes'])->name('procesarOrdenes');
        });
        /////////CLIENTES
        Route::middleware(['submenu:clientes'])->group(function () {
                // Vista principal
                Route::get('Busquedaclientes', [ClientesController::class, 'index'])->name('clientesCompras');
        });
        ////////NOTAS DE CREDITO
        Route::middleware(['submenu:notasDeCredito'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('notasDeCredito', [ClientesController::class, 'notasDeCredito'])->name('notasDeCredito');
                Route::get('/clientes/{clienteId}/facturas', [ClientesController::class, 'facturasTotales']);
                Route::get('/motivos-nota-credito', [ContabilidadController::class, 'motivosNotaCredito']);
                Route::post('/notas-credito', [ContabilidadController::class, 'emitirNotaCredito']);
        });////////NOTAS DE DÉBITO
        Route::middleware(['submenu:notasDeDebito'])->prefix('contabilidad')->group(function () {
                // Vista principal
                Route::get('notasDeDebito', [ClientesController::class, 'notasDeDebito'])->name('notasDeDebito');
                Route::get('/clientes/{clienteId}/facturas', [ClientesController::class, 'facturasTotales']);
                Route::get('/motivos-nota-debito', [ContabilidadController::class, 'motivosNotaDebito']);
                Route::post('/notas-debito', [ContabilidadController::class, 'emitirNotaDebito']);
        });





    });
});

