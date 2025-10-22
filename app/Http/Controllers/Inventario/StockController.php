<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\inventario\StockResource;
use App\Models\Inventario\InventarioAjuste;
use App\Models\Inventario\InventarioAjusteDetalle;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class StockController extends Controller
{

    public function index()
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
            ->whereHas('producto', function ($q) {
                $q->where('es_inventario', 1); 
            })
            ->with(['producto', 'almacen'])
            ->get();


        return Inertia::render('Inventario/InventarioFisico/StockManagement', [
            'stocks' => StockResource::collection($stock),
        ]);
    }


public function updateStock(Request $request, $id)
{
    $request->validate([
        'cantidad_contada' => 'required|numeric|min:0',
        'motivo' => 'nullable|string|max:255', 
    ]);

    $branchId = Session::get('active_branch_id') ?? null;

    $stock = InventarioStock::with('producto')
        ->where('id', $id)
        ->where('almacen_id', $branchId)
        ->first();

    if (!$stock) {
        return response()->json(['error' => 'Stock no encontrado'], 404);
    }

    try {
        $ajuste = InventarioAjuste::create([
            'fecha_ajuste' => now(),
            'almacen_destino_id' => $branchId,
            'usuario_creacion' => Auth::id(),
            'estado_ajuste' => 'nuevo',
            'motivo' => $request->input('motivo'),
        ]);

        InventarioAjusteDetalle::create([
            'ajuste_inventario_id' => $ajuste->id,
            'producto_id' => $stock->producto_id,
            'cantidad_sistema' => $stock->cantidad_actual,
            'cantidad_contada' => $request->input('cantidad_contada'),
        ]);

        return response()->json(['message' => 'Ajuste registrado correctamente.', 'success' => true]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al registrar el ajuste.', 'success' => false]);
    }
}


    public function actualizarMasivo(Request $request)
    {

        $data = $request->input('data');

        if (!is_array($data)) {
            return response()->json(['error' => 'Datos inválidos'], 400);
        }

        $ajustesPorAlmacen = [];

        foreach ($data as $item) {
            if (!isset($item['id']) || !isset($item['cantidad_contada'])) {
                continue;
            }

            $stock = InventarioStock::with('producto')->find($item['id']);
            if (!$stock) {
                continue;
            }

            $almacenId = Session::get('active_branch_id') ?? null;

            $ajustesPorAlmacen[$almacenId][] = [
                'stock' => $stock,
                'cantidad_contada' => $item['cantidad_contada']
            ];
        }

        foreach ($ajustesPorAlmacen as $almacenId => $items) {
            try {
                // Siempre crear nuevo ajuste para cada ejecución
                $ajuste = InventarioAjuste::create([
                    'fecha_ajuste' => now(),
                    'almacen_destino_id' => $almacenId,
                    'usuario_creacion' => Auth::id(),
                    'estado_ajuste' => 'nuevo',
                    'motivo' => 'Ajuste manual masivo',
                ]);

                foreach ($items as $item) {
                    $stock = $item['stock'];
                    $cantidadContada = $item['cantidad_contada'];

                    InventarioAjusteDetalle::create([
                        'ajuste_inventario_id' => $ajuste->id,
                        'producto_id' => $stock->producto_id,
                        'cantidad_sistema' => $stock->cantidad_actual,
                        'cantidad_contada' => $cantidadContada,
                    ]);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Error al crear ajustes masivos: ' . $e->getMessage(), 'success' => false], 500);
            }
        }

        return response()->json([
            'message' => 'Ajustes masivos registrados correctamente.',
            'success' => true
        ]);
    }

    public function obtenerAjuste(Request $request)
    {
        $ajusteId = $request->query('ajuste_id');
        $productoId = $request->query('producto_id');

        $ajusteData = DB::table('inventario_ajustes as ia')
            ->join('inventario_ajuste_detalles as iad', 'ia.id', '=', 'iad.ajuste_inventario_id')
            ->join('productos as p', 'p.id', '=', 'iad.producto_id')
            ->join('almacenes as a', 'a.id', '=', 'ia.almacen_destino_id')
            ->join('users as u', 'u.id', '=', 'ia.usuario_creacion')
            ->where('ia.id', $ajusteId)
            ->where('iad.producto_id', $productoId)
            ->select(
                'p.nombre as producto',
                'a.nombre as almacen',
                'iad.cantidad_sistema as cantidadSistema',
                'iad.cantidad_contada as cantidadContada',
                DB::raw('(iad.cantidad_contada - iad.cantidad_sistema) as diferencia'),
                'ia.fecha_ajuste as fecha',
                'u.name as usuario',
                'ia.motivo'
            )
            ->get();

        return response()->json(['data' => $ajusteData, 'success' => true]);
    }
}
