<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:compras')->group(function () {
    Route::get('/compras', function () {
        return Inertia::render('Compras/Index', [
            'modulo' => 'compras',
        ]);
    })->name('compras');
});
