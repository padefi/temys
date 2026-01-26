<?php

use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\Compras\Proveedores\ProveedoresController;
use App\Http\Controllers\Compras\OrdenCotizaciones\OrdenCotizacionesController;
use App\Http\Controllers\Compras\OrdenCompras\OrdenComprasController;
use App\Http\Controllers\Contabilidad\Clientes\ClientesController;
use App\Http\Controllers\Contabilidad\ContabilidadController;
use App\Http\Controllers\UserModulePanel\UserModuleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Inventario\Productos\ProductoController;
use App\Http\Controllers\General\BancoController;
use App\Http\Controllers\General\MetodoTesoreriaController;
use App\Http\Controllers\General\TarjetaController;
use App\Http\Controllers\General\TipoComprobanteController;
use App\Http\Controllers\General\TipoMonedaController;
use App\Models\Contabilidad\PlanCuentas\Cuenta;

Route::get('/bancos', [BancoController::class, 'index']);

Route::get('/tarjetas', [TarjetaController::class, 'index']);

Route::get('/proveedores/{proveedor}/cbus', [ProveedoresController::class, 'cbus']);
Route::get('/clientes/{cliente}/cbus', [ClientesController::class, 'cbus']);

Route::get('/tipos-comprobantes', [TipoComprobanteController::class, 'index']);

Route::get('/condiciones-venta', [ComprasController::class, 'condicionesVenta']);

Route::get('/tipo-monedas', [TipoMonedaController::class, 'index']);

Route::get('/metodo-pagos', [MetodoTesoreriaController::class, 'index']);

Route::get('/metodo-cobros', [MetodoTesoreriaController::class, 'index']);

Route::get('/cuentas-contables', [ContabilidadController::class, 'planCuentas']);

Route::get('/modelos', [ProductoController::class, 'modelos']);

Route::get('/subcategorias', [ProductoController::class, 'subCategorias']);

Route::get('/cuentas-bancarias/{cuenta}/proximo-cheque', [BancoController::class, 'proximoCheque']);


