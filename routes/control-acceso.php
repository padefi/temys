<?php

use App\Http\Controllers\ControlAcceso\BranchController;
use App\Http\Controllers\ControlAcceso\Users\UsuarioController;
use App\Http\Controllers\ControlAcceso\MenuController;
use App\Http\Controllers\ControlAcceso\ModuleController;
use App\Http\Controllers\ControlAcceso\SubmenuController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('ControlAcceso/Index', [
        'modulo' => 'control-acceso',
    ]);
})->name('control-acceso');

Route::middleware('menu:usuariosControlAcceso')->group(function () {
    Route::middleware('menu_permission:read usuariosControlAcceso')->group(function () {
        Route::get('/usuarios', [UsuarioController::class, 'index'])->name('control-acceso.usuariosControlAcceso');
        Route::get('/get-roles', [UsuarioController::class, 'getRoles']);
        Route::get('/get-module-roles', [UsuarioController::class, 'getModuleRoles']);
        Route::get('/get-role-module-by-user/{user}/{branch}/{module}', [UsuarioController::class, 'getRoleModuleByUser']);

        Route::get('/show-branches-by-user/{user}', [BranchController::class, 'showBranchesByUser']);
        Route::get('/show-modules-by-user/{user}/{branch}', [ModuleController::class, 'showModulesByUser']);
        Route::get('/show-menus-by-user/{user}/{branch}/{module}', [MenuController::class, 'showMenusByUser']);
        Route::get('/show-submenus-by-user/{user}/{branch}/{menu}', [SubmenuController::class, 'showSubmenusByUser']);
    });

    Route::post('/store-user', [UsuarioController::class, 'store'])->middleware('menu_permission:create usuariosControlAcceso');
    Route::patch('/disable-user-active/{user}', [UsuarioController::class, 'manageActive'])->middleware('menu_permission:avoid usuariosControlAcceso');
    Route::patch('/enable-user-active/{user}', [UsuarioController::class, 'manageActive'])->middleware('menu_permission:restore usuariosControlAcceso');

    Route::middleware('menu_permission:update usuariosControlAcceso')->group(function () {
        Route::put('/edit-user/{user}', [UsuarioController::class, 'update']);
        Route::put('/reset-user-password/{user}', [UsuarioController::class, 'resetPassword']);

        Route::post('/managed-role-modules-by-user', [ModuleController::class, 'managedRoleModulesByUser']);

        Route::post('/managed-branches-by-user', [BranchController::class, 'managedBranchesByUser']);
        Route::post('/managed-modules-by-user', [ModuleController::class, 'managedModulesByUser']);
        Route::post('/managed-menus-by-user', [MenuController::class, 'managedMenusByUser']);
        Route::post('/managed-submenus-by-user', [SubmenuController::class, 'managedSubmenusByUser']);

        Route::get('/managed-permissions-modules-by-user/{user}/{branch}/{module}', [ModuleController::class, 'getPermissionsModulesByUser']);
        Route::get('/managed-permissions-menus-by-user/{user}/{branch}/{menu}', [MenuController::class, 'getPermissionsMenusByUser']);
        Route::get('/managed-permissions-submenus-by-user/{user}/{branch}/{submenu}', [SubmenuController::class, 'getPermissionsSubmenusByUser']);

        Route::post('/managed-permissions-modules-by-user', [ModuleController::class, 'managedPermissionsModulesByUser']);
        Route::post('/managed-permissions-menus-by-user', [MenuController::class, 'managedPermissionsMenusByUser']);
        Route::post('/managed-permissions-submenus-by-user', [SubmenuController::class, 'managedPermissionsSubmenusByUser']);
    });
});
