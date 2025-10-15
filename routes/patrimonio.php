<?php

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
                Route::get('/inmuebles', function () {
                    return Inertia::render('Patrimonio/Inmuebles/Inmueble', [
                        'modulo' => 'inmuebles',
                    ]);
                })->name('inmuebles');
            });
        });
    });
});
