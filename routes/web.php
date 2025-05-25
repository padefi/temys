<?php

use App\Http\Controllers\ControlAcceso\MenuController;
use App\Http\Controllers\ControlAcceso\ModuleController;
use App\Http\Controllers\ControlAcceso\ProfileController;
use App\Http\Controllers\ControlAcceso\SubmenuController;
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
    Route::middleware(['module:control-acceso', 'role:admin'])->group(function () {
        Route::middleware('menu:usuarios')->group(function () {
            Route::middleware('menu_permission:read usuarios')->group(function () {
                Route::get('control-acceso/usuarios/usuariosPage', [UsuarioController::class, 'index'])->name('control-acceso.usuarios');
                Route::get('control-acceso/get-roles', [UsuarioController::class, 'getRoles']);
                Route::get('control-acceso/get-role-module-by-user/{user}/{module}', [UsuarioController::class, 'getRoleModuleByUser']);

                Route::get('control-acceso/show-modulos-by-user/{user}', [ModuleController::class, 'showModulesByUser']);
                Route::get('control-acceso/show-menus-by-user/{user}/{module}', [MenuController::class, 'showMenusByUser']);
                Route::get('control-acceso/show-submenus-by-user/{user}/{menu}', [SubmenuController::class, 'showSubmenusByUser']);
            });

            Route::middleware('menu_permission:update usuarios')->group(function () {
                Route::post('control-acceso/managed-role-modulos-by-user', [ModuleController::class, 'managedRoleModulesByUser']);

                Route::post('control-acceso/managed-modulos-by-user', [ModuleController::class, 'managedModulesByUser']);
                Route::post('control-acceso/managed-menus-by-user', [MenuController::class, 'managedMenusByUser']);
                Route::post('control-acceso/managed-submenus-by-user', [SubmenuController::class, 'managedSubmenusByUser']);

                Route::get('control-acceso/managed-permissions-modulos-by-user/{user}/{module}', [ModuleController::class, 'getPermissionsModulesByUser']);
                Route::get('control-acceso/managed-permissions-menus-by-user/{user}/{menu}', [MenuController::class, 'getPermissionsMenusByUser']);
                Route::get('control-acceso/managed-permissions-submenus-by-user/{user}/{submenu}', [SubmenuController::class, 'getPermissionsSubmenusByUser']);

                Route::post('control-acceso/managed-permissions-modulos-by-user', [ModuleController::class, 'managedPermissionsModulesByUser']);
                Route::post('control-acceso/managed-permissions-menus-by-user', [MenuController::class, 'managedPermissionsMenusByUser']);
                Route::post('control-acceso/managed-permissions-submenus-by-user', [SubmenuController::class, 'managedPermissionsSubmenusByUser']);
            });
        });

        Route::get('control-acceso/roles', [UsuarioController::class, 'index'])->name('control-acceso.roles')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/modulos', [UsuarioController::class, 'index'])->name('control-acceso.modulos')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/menus', [UsuarioController::class, 'index'])->name('control-acceso.menus')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/submenus', [UsuarioController::class, 'index'])->name('control-acceso.submenus')->middleware('can:read,' . UsuarioController::class);
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
