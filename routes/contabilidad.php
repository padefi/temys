<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:contabilidad')->group(function () {
    Route::get('/contabilidad', function () {
        return Inertia::render('Contabilidad/Index', [
            'modulo' => 'contabilidad',
        ]);
    })->name('contabilidad');
});
