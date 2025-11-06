<?php

use App\Http\Controllers\ControlAcceso\ProfileController;
use App\Http\Controllers\ControlAcceso\Users\UsuarioController;
use App\Models\ControlAcceso\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'active', 'route_user_active'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');;

    Route::post('/user/branch', [UsuarioController::class, 'updateActiveBranch'])->name('user.update_branch');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy')->middleware('can:avoid,' . User::class);

    /* TO-DO Modulo control accesos */

    Route::middleware(['module:control-acceso', 'role:admin'])->group(function () {
        Route::prefix('control-acceso')->group(base_path('routes/control-acceso.php'));
    });

    /* TO-DO Panel de usuarios de todos los modulos */
    require __DIR__ . '/user-module-panel.php';

    /* TO-DO Modulo afiliados */
    require __DIR__ . '/afiliados.php';

    /* TO-DO Modulo compras */
    require __DIR__ . '/compras.php';

    /* TO-DO Modulo General */
    require __DIR__.'/general.php';

    /* TO-DO Modulo contabilidad */
    require __DIR__ . '/contabilidad.php';

    /* TO-DO Modulo inventario */
    require __DIR__ . '/inventario.php';

    /* TO-DO Modulo seccionales */
    require __DIR__ . '/seccionales.php';

    /* TO-DO Modulo ventas */
    require __DIR__ . '/ventas.php';

    /* TO-DO Modulo patrimonio */
    require __DIR__ . '/patrimonio.php';
});

require __DIR__ . '/auth.php';
