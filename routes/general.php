<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
use App\Http\Controllers\Compras\OrdenCotizaciones\OrdenCotizacionesController;
use App\Http\Controllers\Compras\OrdenCompras\OrdenComprasController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Inventario\Productos\ProductoController;


Route::resource('productos', ProductoController::class);
