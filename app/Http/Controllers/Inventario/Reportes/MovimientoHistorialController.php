<?php

namespace App\Http\Controllers\Inventario\Reportes;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\DataMovimientoStockResource;
use App\Models\Inventario\InventarioMovimientoStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MovimientoHistorialController extends Controller
{
    public function index(Request $request)
    {
        $idProducto = $request->route('idProducto');
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');


        $stock = InventarioMovimientoStock::query()
            ->select(
                'inventario_movimiento_stocks.*',
                'p.nombre as nombreProducto',
                'ao.nombre as origenNombre',
                'ad.nombre as destinoNombre'
            )
            ->join('productos as p', 'inventario_movimiento_stocks.producto_id', '=', 'p.id')
            ->leftJoin('almacenes as ao', 'inventario_movimiento_stocks.origen_id', '=', 'ao.id')
            ->leftJoin('almacenes as ad', 'inventario_movimiento_stocks.destino_id', '=', 'ad.id')
            ->where('inventario_movimiento_stocks.origen_id', $almacenId)
            ->where('p.es_inventario', 1)
            // Filtro condicional por producto
            ->when($idProducto, function ($query, $idProducto) {
                return $query->where('inventario_movimiento_stocks.producto_id', $idProducto);
            })
            ->get();





        $nombreProducto = DB::table('productos')
            ->where('id', $idProducto)
            ->value('nombre');

        return Inertia::render('Inventario/HistorialMovimiento/HistorialManagement', [
            'movimientoStocks' => DataMovimientoStockResource::collection($stock),
            'initialChips' => $idProducto,
            'nombreProducto' => $nombreProducto
        ]);
    }
}
