<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioAjuste;
use App\Models\Inventario\InventarioAjusteDetalle;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockController extends Controller
{

    
public function index()
{
    $almacenId = Auth::id(); // o el ID que representa el almacén del usuario autenticado

    $stock = InventarioStock::query()
        ->leftJoin('inventario_ajuste_detalles as iad', function ($join) {
            $join->on('iad.producto_id', '=', 'inventario_stocks.producto_id');
        })
        ->leftJoin('inventario_ajustes as ia', function ($join) use ($almacenId) {
            $join->on('ia.id', '=', 'iad.ajuste_inventario_id')
                 ->where('ia.almacen_destino_id', '=', $almacenId);
        })
        ->with(['producto', 'almacen'])
        ->where('inventario_stocks.almacen_id', $almacenId)
        ->select('inventario_stocks.*', 'iad.cantidad_contada')
        ->get();

    return Inertia::render('Inventario/InventarioFisico/StockPage', [
        'stocks' => StockResource::collection($stock),
    ]);
}
  /*   public function index()
    {
        $stock = InventarioStock::with(['producto', 'almacen'])
            ->where('almacen_id', Auth::id())
            ->get();
        return Inertia::render('Inventario/InventarioFisico/StockPage', [
            'stocks' => StockResource::collection($stock),
        ]);
    }
 */

    public function getStock()
    {

        $stock = InventarioStock::with(['producto', 'almacen'])
            ->where('almacen_id', 1)
            ->get();
        return response()->json(StockResource::collection($stock));
    }


  public function updateStock(Request $request, $id)
{
    $request->validate([
        'cantidad_contada' => 'required|numeric|min:0',
    ]);

    $stock = InventarioStock::with('producto')->find($id);
    if (!$stock) {
        return response()->json(['error' => 'Stock no encontrado'], 404);
    }
  
    try {
        $ajuste = InventarioAjuste::create([
            'fecha_ajuste' => now(),
            'almacen_destino_id' => $stock->almacen_id,
            'usuario_creacion' => Auth::id(),
            'estado_ajuste' => 'nuevo',
            'motivo' => 'Ajuste manual individual',
        ]);

        InventarioAjusteDetalle::create([
            'ajuste_inventario_id' => $ajuste->id,
            'producto_id' => $stock->producto_id,
            'cantidad_sistema' => $stock->cantidad_actual,
            'cantidad_contada' => $request->input('cantidad_contada'),
        ]);

     

        return response()->json(['message' => 'Ajuste creado correctamente.']);
    } catch (\Exception $e) {
      
        return response()->json(['error' => 'Error al crear el ajuste.'], 500);
    }
}



   /*  public function updateStock(Request $request, $id)
    {
        $request->validate([
            'cantidad_contada' => 'required|numeric|min:0',
        ]);
        $solicitud = InventarioStock::find($id);
        if (!$solicitud) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }
        $solicitud->cantidad_contada = $request->input('cantidad_contada');
        $solicitud->usuario_actualizacion = Auth::id();
        $solicitud->save();
        return response()->json(['message' => 'Cantidad aprobada actualizada correctamente']);
    }


    public function actualizarMasivo(Request $request)
    {
        $data = $request->input('data');

        if (!is_array($data)) {
            return response()->json(['error' => 'Datos inválidos'], 400);
        }

        foreach ($data as $item) {

            if (!isset($item['id']) || !isset($item['cantidad_contada'])) {
                continue;
            }

            // Buscar el registro y actualizar si existe
            $stock = InventarioStock::find($item['id']);
            if ($stock) {
                $stock->cantidad_contada = $item['cantidad_contada'];
                $stock->usuario_actualizacion = Auth::id();
                $stock->save();
            }
        }

        return response()->json([
            'message' => 'Cantidad contada actualizada correctamente para los productos modificados.'
        ]);
    }
} */
}