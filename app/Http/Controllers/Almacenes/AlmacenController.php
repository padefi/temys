<?php

namespace App\Http\Controllers\Almacenes;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\AlmacenResource;
use App\Models\Almacenes\Almacen;
use Illuminate\Http\Request;

class AlmacenController extends Controller
{
    public function index()
    {
        $almacenes = Almacen::all();
        return AlmacenResource::collection($almacenes);
    }
}

