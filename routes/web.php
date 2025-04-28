<?php

use App\Http\Controllers\ControlAcceso\ProfileController;
use App\Http\Controllers\ControlAcceso\Users\UsuarioController;
use App\Models\ControlAcceso\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit')->middleware('can:read,' . User::class);
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update')->middleware('can:update,' . User::class);
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy')->middleware('can:avoid,' . User::class);

    /* TO-DO Modulo control accesos */
    Route::middleware('module:control-acceso')->group(function () {
        Route::middleware('menu:usuarios')->group(function () {
            Route::get('control-acceso/usuarios/usuariosPage', [UsuarioController::class, 'index'])->name('control-acceso.usuarios')->middleware('can:read,' . UsuarioController::class);
            Route::get('control-acceso/roles', [UsuarioController::class, 'index'])->name('control-acceso.roles')->middleware('can:read,' . UsuarioController::class);
            Route::get('control-acceso/modulos', [UsuarioController::class, 'index'])->name('control-acceso.modulos')->middleware('can:read,' . UsuarioController::class);
            Route::get('control-acceso/menus', [UsuarioController::class, 'index'])->name('control-acceso.menus')->middleware('can:read,' . UsuarioController::class);
            Route::get('control-acceso/submenus', [UsuarioController::class, 'index'])->name('control-acceso.submenus')->middleware('can:read,' . UsuarioController::class);
        });
    });

    /* TO-DO Modulo afiliados */
    Route::middleware('module:afiliados')->group(function () {
    });

    /* TO-DO Modulo compras */
    Route::middleware('module:compras')->group(function () {
    });

    /* TO-DO Modulo contabilidad */
    Route::middleware('module:contabilidad')->group(function () {
    });

    /* TO-DO Modulo inventario */
    Route::middleware('module:inventario')->group(function () {
    });

    /* TO-DO Modulo seccionales */
    Route::middleware('module:seccionales')->group(function () {
    });

    /* TO-DO Modulo ventas */
    Route::middleware('module:ventas')->group(function () {
    });
});

require __DIR__ . '/auth.php';
