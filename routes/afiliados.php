<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/afiliados', function () {
    return Inertia::render('Afiliados/Index', [
        'modulo' => 'afiliados',
    ]);
})->name('afiliados');
