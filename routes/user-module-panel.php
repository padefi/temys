<?php

use App\Http\Controllers\UserModulePanel\UserModuleController;
use App\Http\Controllers\ControlAcceso\MenuController;
use App\Http\Controllers\ControlAcceso\ModuleController;
use App\Http\Controllers\ControlAcceso\SubmenuController;
use Illuminate\Support\Facades\Route;

Route::middleware('role_module:encargado')->group(function () {
    Route::get('user-model-panel/get-module-roles', [UserModuleController::class, 'getModuleRoles']);
    Route::get('user-model-panel/get-module-by-user/{user}/{module}', [UserModuleController::class, 'showModuleByUser']);
    Route::get('user-model-panel/managed-permissions-modulos-by-user/{user}/{module}', [ModuleController::class, 'getPermissionsModulesByUser']);
    Route::get('user-model-panel/managed-permissions-menus-by-user/{user}/{menu}', [MenuController::class, 'getPermissionsMenusByUser']);
    Route::get('user-model-panel/show-menus-by-user/{user}/{module}', [MenuController::class, 'showMenusByUser']);
    Route::get('user-model-panel/managed-permissions-submenus-by-user/{user}/{submenu}', [SubmenuController::class, 'getPermissionsSubmenusByUser']);
    Route::get('user-model-panel/show-submenus-by-user/{user}/{menu}', [SubmenuController::class, 'showSubmenusByUser']);

    Route::post('user-model-panel/managed-permissions
        -modulos-by-user', [ModuleController::class, 'managedPermissionsModulesByUser']);
    Route::post('user-model-panel/managed-permissions-menus-by-user', [MenuController::class, 'managedPermissionsMenusByUser']);
    Route::post('user-model-panel/managed-menus-by-user', [MenuController::class, 'managedMenusByUser']);
    Route::post('user-model-panel/managed-permissions-submenus-by-user', [SubmenuController::class, 'managedPermissionsSubmenusByUser']);
    Route::post('user-model-panel/managed-submenus-by-user', [SubmenuController::class, 'managedSubmenusByUser']);
});
