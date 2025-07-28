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

    $modules = [
        [
            'menu' =>  'configuracionAfiliados',
            'submenu' => 'usuariosAfiliados',
            'role' => 'encargado afiliados',
            'permission' => 'usuariosAfiliados',
            'path' => 'afiliados/usuarios',
            'name' => 'usuariosAfiliados',
        ],
        [
            'menu' => 'configuracionCompras',
            'submenu' => 'usuariosCompras',
            'role' => 'encargado compras',
            'permission' => 'usuariosCompras',
            'path' => 'compras/usuarios',
            'name' => 'usuariosCompras',
        ],
        [
            'menu' => 'configuracionContabilidad',
            'submenu' => 'usuariosContabilidad',
            'role' => 'encargado contabilidad',
            'permission' => 'usuariosContabilidad',
            'path' => 'contabilidad/usuarios',
            'name' => 'usuariosContabilidad',
        ],
        [
            'menu' => 'configuracionInventario',
            'submenu' => 'usuariosInventario',
            'role' => 'encargado inventario',
            'permission' => 'usuariosInventario',
            'path' => 'inventario/usuarios',
            'name' => 'usuariosInventario',
        ],
        [
            'menu' => 'configuracionSeccionales',
            'submenu' => 'usuariosSeccionales',
            'role' => 'encargado seccionales',
            'permission' => 'usuariosSeccionales',
            'path' => 'seccionales/usuarios',
            'name' => 'usuariosSeccionales',
        ],
        [
            'menu' => 'configuracionVentas',
            'submenu' => 'usuariosVentas',
            'role' => 'encargado ventas',
            'permission' => 'usuariosVentas',
            'path' => 'ventas/usuarios',
            'name' => 'usuariosVentas',
        ],
        [
            'menu' => 'configuracionPatrimonio',
            'submenu' => 'usuariosPatrimonio',
            'role' => 'encargado patrimonio',
            'permission' => 'usuariosPatrimonio',
            'path' => 'patrimonio/usuarios',
            'name' => 'usuariosPatrimonio',
        ],        
    ];

    foreach ($modules as $mod) {
        Route::middleware(array_filter([
            $mod['menu'] ? "menu:{$mod['menu']}" : null,
            "submenu:{$mod['submenu']}",
            "role_module:{$mod['role']}",
        ]))->group(function () use ($mod) {
            Route::middleware("submenu_permission:read {$mod['permission']}")->group(function () use ($mod) {
                Route::get($mod['path'], [UserModuleController::class, 'index'])->name($mod['name']);
            });
        });
    }
});
