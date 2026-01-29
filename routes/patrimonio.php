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

            Route::middleware('submenu_permission:create inmuebles')->group(function () {
                Route::post('patrimonio/inmuebles/create-inmueble',  [InmuebleController::class, 'createInmueble'])->name('create.inmueble');
                Route::get('patrimonio/inmuebles/new-inmueble',  [InmuebleController::class, 'newInmuebles'])->name('new.inmueble');
            });

            Route::middleware('submenu_permission:read inmuebles')->group(function () {
                Route::get('patrimonio/inmuebles/estados',  [InmuebleController::class, 'showEstados'])->name('inmuebles.estados');
                Route::get('patrimonio/inmuebles/tipos-inmuebles',  [InmuebleController::class, 'showTiposInmuebles'])->name('inmuebles.tipos.inmuebles');
                Route::get('patrimonio/inmuebles/tipos-ocupacion',  [InmuebleController::class, 'showTiposOcupacion'])->name('inmuebles.tipos.ocupacion');
                Route::get('patrimonio/inmuebles/tipos-contrato',  [InmuebleController::class, 'showTipoContrato'])->name('inmuebles.tipos.contrato');
                Route::get('patrimonio/inmuebles/tipos-contacto',  [InmuebleController::class, 'showTipoContacto'])->name('inmuebles.tipos.contacto');
                Route::get('patrimonio/inmuebles/branches',  [InmuebleController::class, 'showBranch'])->name('inmuebles.branches');
            });
        });
    });

    Route::get('/provincias', [UbicacionController::class, 'provincias']);
    Route::get('/localidades/{provinciaId}', [UbicacionController::class, 'localidades']);
    Route::get('/calles/{localidadId}', [UbicacionController::class, 'calles']);
});
