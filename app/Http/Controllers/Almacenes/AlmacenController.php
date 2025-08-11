<?php

namespace App\Http\Controllers\Almacenes;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\AlmacenResource;
use App\Models\Almacenes\Almacen;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlmacenController extends Controller
{
    public function index()
    {
        $almacenes = Almacen::all();
        return AlmacenResource::collection($almacenes);
    }

    public function obtenerStockProductos(Request $request)
    {
         $productoIds = $request->input('productos');
    
         return InventarioStock::with('almacen','producto')
            ->whereIn('producto_id', $productoIds)
            ->whereColumn('cantidad_actual', '>', 'stock_minimo')
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => $stock->almacen->id,
                    'producto_id'=>$stock->producto_id,
                    'nombre' => $stock->almacen->nombre,
                    'nombre_producto' => $stock->producto->nombre,
                    'cantidad_actual' => $stock->cantidad_actual,
                ];
            }); 
    }
}
