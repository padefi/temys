<?php
namespace App\Http\Controllers\Inventario\Reportes;
use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\DataExistenciasResource;
use App\Models\Inventario\InventarioStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ExistenciasController extends Controller
{

    public function index() //verificar si trae el dato de la cantidad contada para asi poder ocultar el boton de ajuste  
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

        $recepcionesSub = DB::table('inventario_recepcion_productos as ir')
            ->join('inventario_recepcion_detalles as ird', 'ird.recepcion_id', '=', 'ir.id')
            ->select(
                'ird.producto_id',
                'ir.destino_id',
                'ird.cantidad_recibida as total_recibido'
            )
            ->where('ir.estado', '!=', 'Pendiente');

        $entregasSub = DB::table('inventario_orden_entregas as io')
            ->join('inventario_orden_entrega_detalles as ioe', 'ioe.orden_entrega_id', '=', 'io.id')
            ->select(
                'ioe.producto_id',
                'io.destino_id',
                'ioe.cantidad_enviada as total_entregado',
                'io.estado'
            )
            ->where('io.estado', '!=', 'Cancelado');

        $stock = InventarioStock::query()
            ->select(
                'inventario_stocks.*',
                'prod.*',
                'rec.total_recibido',
                'ent.total_entregado',
                'ent.estado as estadoEntregas',
                'aj.cantidad_contada',
                'aj.estado_ajuste'
            )
            ->joinSub($productoSub, 'prod', function ($join) {
                $join->on('prod.id', '=', 'inventario_stocks.producto_id');
            })
            ->leftJoinSub($ajustesSub, 'aj', function ($join) {
                $join->on('aj.producto_id', '=', 'inventario_stocks.producto_id')
                    ->on('aj.almacen_destino_id', '=', 'inventario_stocks.almacen_id')
                    ->where('estado_ajuste', 'nuevo');
            })
            ->leftJoinSub($recepcionesSub, 'rec', function ($join) {
                $join->on('rec.producto_id', '=', 'inventario_stocks.producto_id')
                    ->on('rec.destino_id', '=', 'inventario_stocks.almacen_id');
            })
            ->leftJoinSub($entregasSub, 'ent', function ($join) {
                $join->on('ent.producto_id', '=', 'inventario_stocks.producto_id')
                    ->on('ent.destino_id', '=', 'inventario_stocks.almacen_id');
            })
            ->where('inventario_stocks.almacen_id', $almacenId)
            ->with(['producto', 'almacen'])
            ->get();

        return Inertia::render('Inventario/Existencias/ExistenciaManagement', [
            'stocks' => DataExistenciasResource::collection($stock),
        ]);
    }

    public function ajusteProducto($id)
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

        $stock = InventarioStock::query()
            ->select(
                'inventario_stocks.*',
                'aj.cantidad_contada',
                'aj.estado_ajuste',
                'aj.ajuste_id'
            )
            ->leftJoinSub($ajustesSub, 'aj', function ($join) {
                $join->on('aj.producto_id', '=', 'inventario_stocks.producto_id')
                    ->on('aj.almacen_destino_id', '=', 'inventario_stocks.almacen_id')
                    ->where('estado_ajuste', 'nuevo');
            })
            ->where('inventario_stocks.almacen_id', $almacenId)
            ->where('inventario_stocks.producto_id', $id)
            ->whereHas('producto', function ($q) {
                $q->where('es_inventario', 1);
            })
            ->with(['producto', 'almacen'])
            ->get();


        return response()->json(['data' => $stock, 'success' => true]);
    }
}
