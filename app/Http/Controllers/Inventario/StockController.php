<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class StockController extends Controller
{

    public function index(Request $request)
    {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');

        $ajustesSub = DB::table('inventario_ajuste_detalles as iad')
            ->select(
                'ia.id as ajuste_id',
                'iad.producto_id',
                'ia.almacen_destino_id',
                'iad.cantidad_contada',
                'ia.estado_ajuste'
            )
            ->join('inventario_ajustes as ia', 'ia.id', '=', 'iad.ajuste_inventario_id');

        $productoSub = DB::table('productos as p')
            ->join('producto_subcategorias as psc', 'psc.id', '=', 'p.subcategoria_id')
            ->join('producto_categorias as pc', 'pc.id', '=', 'psc.categoria_id')
            ->select('p.id', 'p.nombre', 'psc.descripcion AS subCategoria', 'pc.descripcion AS categoria')
            ->where('p.es_inventario', 1);
            
        $inventarioStock = QueryBuilder::for(

            InventarioStock::query()
                ->select(
                    'inventario_stocks.*',
                    'aj.cantidad_contada',
                    'aj.estado_ajuste',
                    'aj.ajuste_id'
                )->joinSub($productoSub, 'prod', function ($join) {
                    $join->on('prod.id', '=', 'inventario_stocks.producto_id');
                })

                ->leftJoinSub($ajustesSub, 'aj', function ($join) {
                    $join->on('aj.producto_id', '=', 'inventario_stocks.producto_id')
                        ->on('aj.almacen_destino_id', '=', 'inventario_stocks.almacen_id')
                        ->where('estado_ajuste', 'nuevo');
                })
                ->where('inventario_stocks.almacen_id', $almacenId)
              /*   ->whereHas('producto', function ($q) {
                    $q->where('es_inventario', 1);
                }) */
                ->with(['producto', 'almacen'])

        )->allowedFilters([
            AllowedFilter::callback('producto', function ($query, $value) {
                $query->where('prod.nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('almacen', function ($query, $value) {
                $query->where('nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::partial('cantidad_actual'),
        ])

            ->allowedSorts([
                'cantidad_actual',
                'almacen',
                'producto',
                'cantidad_contada'
            ])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();


        $activeFilters = $request->input('filter', []);

        return Inertia::render('Inventario/InventarioFisico/StockManagement', [
            'stocks' => StockResource::collection($inventarioStock),
            'filters' => $activeFilters,

        ]);
    }


}
