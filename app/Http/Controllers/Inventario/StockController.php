<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $stock = InventarioStock::with(['producto', 'almacen'])
            /* ->where('almacen_id', 1) */
            ->get();
        return Inertia::render('Inventario/StockPage', [
            'stocks' => StockResource::collection($stock),
        ]);
    }
    public function getStock()
    {
        $stock = InventarioStock::with(['producto', 'almacen'])
            ->where('almacen_id', 1)
            ->get();

        return response()->json(StockResource::collection($stock));
    }
}
