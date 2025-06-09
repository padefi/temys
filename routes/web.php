<?php

use App\Http\Controllers\ControlAcceso\MenuController;
use App\Http\Controllers\ControlAcceso\ModuleController;
use App\Http\Controllers\ControlAcceso\ProfileController;
use App\Http\Controllers\ControlAcceso\SubmenuController;
use App\Http\Controllers\ControlAcceso\Users\UsuarioController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use App\Models\ControlAcceso\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'active', 'route_user_active'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');;

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit')->middleware('can:read,' . User::class);
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update')->middleware('can:update,' . User::class);
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy')->middleware('can:avoid,' . User::class);

    /* TO-DO Modulo control accesos */
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

            Route::middleware('menu_permission:update usuariosControlAcceso')->group(function () {
                Route::put('control-acceso/edit-user/{user}', [UsuarioController::class, 'update']);
                Route::put('control-acceso/reset-user-password/{user}', [UsuarioController::class, 'resetPassword']);
                Route::put('control-acceso/managed-user-active/{user}', [UsuarioController::class, 'manageActive']);

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

    /* TO-DO Panel de usuarios de todos los modulos */
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

    /* TO-DO Modulo afiliados */
    Route::middleware('module:afiliados')->group(function () {
        Route::get('/afiliados', function () {
            return Inertia::render('ControlAcceso/Index', [
                'modulo' => 'afiliados',
            ]);
        })->name('afiliados');

        Route::middleware(['menu:configuracionAfiliados'])->group(function () {
            Route::middleware(['submenu:usuariosAfiliados', 'role_module:encargado afiliados'])->group(function () {
                Route::middleware('submenu_permission:read usuariosAfiliados')->group(function () {
                    Route::get('afiliados/usuarios', [UserModuleController::class, 'index'])->name('usuariosAfiliados');
                });
            });
        });
    });

    /* TO-DO Modulo compras */
    Route::middleware('module:compras')->group(function () {
        Route::get('/compras', function () {
            return Inertia::render('Inventario/Index', [
                'modulo' => 'compras',
            ]);
        })->name('compras');

        Route::middleware(['menu:configuracionCompras'])->group(function () {
            Route::middleware(['submenu:usuariosCompras', 'role_module:encargado compras'])->group(function () {
                Route::middleware('submenu_permission:read usuariosCompras')->group(function () {
                    Route::get('compras/usuarios', [UserModuleController::class, 'index'])->name('usuariosCompras');
                });
            });
        });
    });

    /* TO-DO Modulo contabilidad */
    Route::middleware('module:contabilidad')->group(function () {
        Route::get('/contabilidad', function () {
            return Inertia::render('Contabilidad/Index', [
                'modulo' => 'contabilidad',
            ]);
        })->name('contabilidad');

        Route::middleware(['menu:configuracionContabilidad'])->group(function () {
            Route::middleware(['submenu:usuariosContabilidad', 'role_module:encargado contabilidad'])->group(function () {
                Route::middleware('submenu_permission:read usuariosContabilidad')->group(function () {
                    Route::get('contabilidad/usuarios', [UserModuleController::class, 'index'])->name('usuariosContabilidad');
                });
            });
        });
    });

    /* TO-DO Modulo inventario */
    Route::middleware('module:inventario')->group(function () {
        Route::get('/inventario', function () {
            return Inertia::render('Contabilidad/Index', [
                'modulo' => 'inventario',
            ]);
        })->name('inventario');

        Route::middleware(['menu:configuracionInventario'])->group(function () {
            Route::middleware(['submenu:usuariosInventario', 'role_module:encargado inventario'])->group(function () {
                Route::middleware('submenu_permission:read usuariosInventario')->group(function () {
                    Route::get('inventario/usuarios', [UserModuleController::class, 'index'])->name('usuariosInventario');
                });
            });
        });
    });

    /* TO-DO Modulo seccionales */
    Route::middleware('module:seccionales')->group(function () {
        Route::get('/seccionales', function () {
            return Inertia::render('Seccionales/Index', [
                'modulo' => 'seccionales',
            ]);
        })->name('seccionales');

        Route::middleware(['menu:configuracionSeccionales'])->group(function () {
            Route::middleware(['submenu:usuariosSeccionales', 'role_module:encargado seccionales'])->group(function () {
                Route::middleware('submenu_permission:read usuariosSeccionales')->group(function () {
                    Route::get('seccionales/usuarios', [UserModuleController::class, 'index'])->name('usuariosSeccionales');
                });
            });
        });
    });

    /* TO-DO Modulo ventas */
    Route::middleware('module:ventas')->group(function () {
        Route::get('/ventas', function () {
            return Inertia::render('Ventas/Index', [
                'modulo' => 'ventas',
            ]);
        })->name('ventas');

        Route::middleware(['menu:configuracionVentas'])->group(function () {
            Route::middleware(['submenu:usuariosVentas', 'role_module:encargado ventas'])->group(function () {
                Route::middleware('submenu_permission:read usuariosVentas')->group(function () {
                    Route::get('ventas/usuarios', [UserModuleController::class, 'index'])->name('usuariosVentas');
                });
            });
        });
    });

    /* TO-DO Modulo patrimonio */
    Route::middleware('module:patrimonio')->group(function () {
        Route::get('/patrimonio', function () {
            return Inertia::render('Patrimonio/Index', [
                'modulo' => 'patrimonio',
            ]);
        })->name('patrimonio');

        Route::middleware(['menu:configuracionPatrimonio'])->group(function () {
            Route::middleware(['submenu:usuariosPatrimonio', 'role_module:encargado patrimonio'])->group(function () {
                Route::middleware('submenu_permission:read usuariosPatrimonio')->group(function () {
                    Route::get('patrimonio/usuarios', [UserModuleController::class, 'index'])->name('usuariosPatrimonio');
                });
            });
        });
    });
});

require __DIR__ . '/auth.php';
