<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:ventas')->group(function () {
    Route::get('/ventas', function () {
        return Inertia::render('Ventas/Index', [
            'modulo' => 'ventas',
        ]);
    })->name('ventas');
});
