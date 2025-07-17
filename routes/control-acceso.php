<?php

use App\Http\Controllers\ControlAcceso\Users\UsuarioController;
use App\Http\Controllers\ControlAcceso\MenuController;
use App\Http\Controllers\ControlAcceso\ModuleController;
use App\Http\Controllers\ControlAcceso\SubmenuController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['module:control-acceso', 'role:admin'])->group(function () {
    Route::get('/control-acceso', function () {
        return Inertia::render('ControlAcceso/Index', [
            'modulo' => 'control-acceso',
        ]);
    })->name('control-acceso');

    Route::middleware('menu:usuariosControlAcceso')->group(function () {
        Route::middleware('menu_permission:read usuariosControlAcceso')->group(function () {
            Route::get('control-acceso/usuarios', [UsuarioController::class, 'index'])->name('control-acceso.usuariosControlAcceso');
            Route::get('control-acceso/get-roles', [UsuarioController::class, 'getRoles']);
            Route::get('control-acceso/get-module-roles', [UsuarioController::class, 'getModuleRoles']);
            Route::get('control-acceso/get-role-module-by-user/{user}/{module}', [UsuarioController::class, 'getRoleModuleByUser']);

            Route::get('control-acceso/show-modulos-by-user/{user}', [ModuleController::class, 'showModulesByUser']);
            Route::get('control-acceso/show-menus-by-user/{user}/{module}', [MenuController::class, 'showMenusByUser']);
            Route::get('control-acceso/show-submenus-by-user/{user}/{menu}', [SubmenuController::class, 'showSubmenusByUser']);
        });

        Route::post('control-acceso/store-user', [UsuarioController::class, 'store'])->middleware('menu_permission:create usuariosControlAcceso');
        Route::patch('control-acceso/disable-user-active/{user}', [UsuarioController::class, 'manageActive'])->middleware('menu_permission:avoid usuariosControlAcceso');
        Route::patch('control-acceso/enable-user-active/{user}', [UsuarioController::class, 'manageActive'])->middleware('menu_permission:restore usuariosControlAcceso');

        Route::middleware('menu_permission:update usuariosControlAcceso')->group(function () {
            Route::put('control-acceso/edit-user/{user}', [UsuarioController::class, 'update']);
            Route::put('control-acceso/reset-user-password/{user}', [UsuarioController::class, 'resetPassword']);

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


    /* TO-DO Panel demás menús */
    /* Route::get('control-acceso/roles', [UsuarioController::class, 'index'])->name('control-acceso.roles')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/modulos', [UsuarioController::class, 'index'])->name('control-acceso.modulos')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/menus', [UsuarioController::class, 'index'])->name('control-acceso.menus')->middleware('can:read,' . UsuarioController::class);
        Route::get('control-acceso/submenus', [UsuarioController::class, 'index'])->name('control-acceso.submenus')->middleware('can:read,' . UsuarioController::class); */
});
