<?php

use App\Http\Controllers\Georef\GeorefController;
use Illuminate\Support\Facades\Route;

// Rutas para API Georef (búsqueda de direcciones) - Sistema Híbrido
Route::get('/general/georef/direcciones', [GeorefController::class, 'buscarDirecciones']);

Route::get('/general/georef/calles', [GeorefController::class, 'buscarCalles']);
Route::get('/general/georef/provincias', [GeorefController::class, 'buscarProvincias']);
Route::get('/general/georef/localidades', [GeorefController::class, 'buscarLocalidades']);
Route::post('/general/georef/normalizar', [GeorefController::class, 'normalizarDireccion']);
Route::get('/general/georef/status', [GeorefController::class, 'checkAPIStatus']);
