<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:patrimonio')->group(function () {
    Route::get('/patrimonio', function () {
        return Inertia::render('Patrimonio/Index', [
            'modulo' => 'patrimonio',
        ]);
    })->name('patrimonio');
});
