<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
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
Route::middleware(['menu:ordenes'])->group(function () {
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
});
