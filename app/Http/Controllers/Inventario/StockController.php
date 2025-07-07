<?php
namespace App\Http\Controllers\Inventario;
use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\SolicitudRecibidaStockResource;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioSolicitarStock;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\SolicitudRecibidaStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function solicitarStock(Request $request){
            $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_solicitante_id' => 'required|exists:almacenes,id',
            'almacen_proovedor_id' => 'required|exists:almacenes,id',
            'cantidad_solicitada' => 'required|integer|min:1',
            'prioridad' => 'required|string|max:50',
            'motivo' => 'nullable|string|max:255',
        ]);
             InventarioSolicitarStock::create([
            'producto_id' => $validated['producto_id'],
            'almacen_solicitante_id' => $validated['almacen_solicitante_id'],
            'almacen_proovedor_id' => $validated['almacen_proovedor_id'],
            'cantidad_solicitada' => $validated['cantidad_solicitada'],
            'prioridad' => $validated['prioridad'],
            'motivo' => $validated['motivo'] ?? null,
            'fecha_creacion' => now(),
            'usuario_creacion' => Auth::user()->id, 
        ]);

    }

    public function getSolicitudesAll(){
          $solicitudes=SolicitudRecibidaStock::with(['producto', 'almacensolicitante'])
          ->get();
         return response()->json(SolicitudRecibidaStockResource::collection($solicitudes));
    }
    public function getSolicitudesAlmacen($id){
       $solicitud = InventarioSolicitarStock::with([
        'producto',
        'almacensolicitante',
        'almacenProovedor'
    ])->find($id);

    if (!$solicitud) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    return response()->json($solicitud);
    }
}
