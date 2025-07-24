<?php
namespace App\Http\Controllers\Inventario;
use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioStock;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $stock = InventarioStock::with(['producto', 'almacen'])
            ->where('almacen_id', Auth::id()) 
            ->get();
        return Inertia::render('Inventario/InventarioFisico/StockPage', [
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
