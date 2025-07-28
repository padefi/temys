<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('module:seccionales')->group(function () {
    Route::get('/seccionales', function () {
        return Inertia::render('Seccionales/Index', [
            'modulo' => 'seccionales',
        ]);
    })->name('seccionales');
});
