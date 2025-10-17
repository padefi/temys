<?php

use App\Http\Controllers\Patrimonio\Inmuebles\InmuebleController;
use App\Http\Controllers\Patrimonio\UbicacionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:patrimonio')->group(function () {
    Route::get('/patrimonio', function () {
        return Inertia::render('Patrimonio/Index', [
            'modulo' => 'patrimonio',
        ]);
    })->name('patrimonio');

    Route::middleware(['menu:inmuebles'])->group(callback: function () {
        Route::middleware(['submenu:inmuebles'])->group(function () {
            Route::middleware('submenu_permission:read inmuebles')->group(function () {
                Route::get('patrimonio/inmuebles',  [InmuebleController::class, 'index'])->name('inmuebles');
            });
        });
    });

    Route::get('/provincias', [UbicacionController::class, 'provincias']);
    Route::get('/localidades/{provinciaId}', [UbicacionController::class, 'localidades']);
    Route::get('/calles/{localidadId}', [UbicacionController::class, 'calles']);
});
