<?php

namespace App\Http\Controllers\Inventario\Reportes;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\DataMovimientoStockResource;
use App\Models\Inventario\InventarioMovimientoStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

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

        $movimientoStock = QueryBuilder::for(
            InventarioMovimientoStock::query()
                ->select(
                    'inventario_movimiento_stocks.*',
                    'p.nombre as nombreProducto',
                    'ao.nombre as origen',
                    'ad.nombre as destino',
                    DB::raw('CONCAT(u.name," ",u.last_name) as usuarioCreacion')
                )
                ->join('productos as p', 'inventario_movimiento_stocks.producto_id', '=', 'p.id')
                ->join('users as u', 'inventario_movimiento_stocks.usuario_creacion', '=', 'u.id')
                ->leftJoin('almacenes as ao', 'inventario_movimiento_stocks.origen_id', '=', 'ao.id')
                ->leftJoin('almacenes as ad', 'inventario_movimiento_stocks.destino_id', '=', 'ad.id')
                ->where('inventario_movimiento_stocks.destino_id', $almacenId)
                ->where('p.es_inventario', 1)
        )
            ->allowedFilters([
                AllowedFilter::callback('origen', function ($query, $value) {
                    $query->where('ao.nombre', 'LIKE', "%{$value}%");
                }),
                AllowedFilter::callback('destino', function ($query, $value) {
                    $query->where('ad.nombre', 'LIKE', "%{$value}%");
                }),
                AllowedFilter::callback('nombreProducto', function ($query, $value) {
                    $query->where('p.nombre', 'LIKE', "%{$value}%");
                }),
                AllowedFilter::partial('tipo_movimiento'),
                AllowedFilter::callback('usuarioCreacion', function ($query, $value) {
                    $query->whereRaw("CONCAT(u.name, ' ', u.last_name) LIKE ?", ["%{$value}%"]);
                }),

            ])

            ->allowedSorts([
                'nombreProducto',
                'tipo_movimiento',
                'origen',
                'destino',
                'usuarioCreacion',
                'cantidad',
            ])

            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $nombreProducto = DB::table('productos')
            ->where('id', $idProducto)
            ->value('nombre');

        return Inertia::render('Inventario/HistorialMovimiento/HistorialManagement', [
            'movimientoStocks' => DataMovimientoStockResource::collection($movimientoStock),
            'initialChips' => $idProducto,
            'nombreProducto' => $nombreProducto,


        ]);
    }
}
