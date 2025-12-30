<?php

namespace App\Http\Controllers\Almacenes;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\AlmacenResource;
use App\Models\Almacenes\Almacen;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;

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

        // Traemos todos los registros relacionados a los productos seleccionados
        $stocks = InventarioStock::with('almacen', 'producto')
            ->whereIn('producto_id', $productoIds)
            ->get()
            ->groupBy('almacen_id')   // 👉 Agrupa por almacén
            ->map(function ($grupoPorAlmacen) {

                // Elegimos el primer registro para obtener los datos del almacén
                $almacenInfo = $grupoPorAlmacen->first();

                return [
                    'almacen_id' => $almacenInfo->almacen->id,
                    'almacen'    => $almacenInfo->almacen->nombre,

                    // 👇 Lista de productos encontrados en este almacén
                    'productos' => $grupoPorAlmacen->map(function ($stock) {
                        return [
                            'producto_id'     => $stock->producto_id,
                            'producto'        => $stock->producto->nombre,
                            'cantidad_actual' => $stock->cantidad_actual,
                            'stock_minimo'    => $stock->stock_minimo,
                        ];
                    })->values()
                ];
            })
            ->values(); // Limpia las claves del map

        return response()->json($stocks);
    }

    /*   public function obtenerStockProductos(Request $request)
    {
        $productoIds = $request->input('productos');

        $stocks = InventarioStock::with('almacen', 'producto')
            ->whereIn('producto_id', $productoIds)
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => $stock->almacen->id,
                    'producto_id' => $stock->producto_id,
                    'nombre' => $stock->almacen->nombre,
                    'nombre_producto' => $stock->producto->nombre,
                    'cantidad_actual' => $stock->cantidad_actual,
                    'stock_minimo' => $stock->stock_minimo,
                ];
            });

        return response()->json($stocks);
    } */
}
