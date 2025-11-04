<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Models\Inventario\InventarioAjuste;
use App\Models\Inventario\InventarioAjusteDetalle;
use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class AjustesController extends Controller
{
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
                'p.id as productoId',
                'a.id as almacenId',
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

   /*  public function aprobarAjuste(Request $request)
    {
        try {
            $ajuste = InventarioMovimientoStock::create([
                'producto_id' => $request->input('producto_id'),
                'origen_id' => $request->input('almacen_id'),
                'destino_id' => $request->input('almacen_id'),
                'cantidad' => $request->input('cantidad_contada'),
                'tipo_movimiento' => 'ajuste',
                'fecha_creacion' => now(),
                'usuario_creacion' => Auth::id(),
            ]);

            // Actualizar el stock con la cantidad contada
            InventarioStock::where('producto_id', $request->input('producto_id'))
                ->where('almacen_id', $request->input('almacen_id'))
                ->update([
                    'cantidad_actual' => $request->input('cantidad_contada'),
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]);
            //actualizar el estado del ajuste
            InventarioAjuste::where('id', $request->input('ajuste_id'))
                ->update([
                    'estado_ajuste' => 'hecho',

                ]);

            return response()->json([
                'success' => true,
                'message' => 'Ajuste aprobado correctamente',
                'ajuste' => $ajuste
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al aprobar ajuste: ' . $e->getMessage(), 'success' => false], 500);
        }
    } */

        public function aprobarAjuste(Request $request)
{
    try {
        DB::transaction(function () use ($request) {
            // Buscar el ajuste
            $ajuste = InventarioAjuste::findOrFail($request->input('ajuste_id'));

            // Crear movimiento polimórfico asociado al ajuste
            $ajuste->movimientos()->create([
                'producto_id' => $request->input('producto_id'),
                'origen_id' => $request->input('almacen_id'),
                'destino_id' => $request->input('almacen_id'),
                'cantidad' => $request->input('cantidad_contada'),
                'tipo_movimiento' => 'ajuste',
                'fecha_creacion' => now(),
                'usuario_creacion' => Auth::id(),
            ]);

            // Actualizar stock con la cantidad contada
            InventarioStock::where('producto_id', $request->input('producto_id'))
                ->where('almacen_id', $request->input('almacen_id'))
                ->update([
                    'cantidad_actual' => $request->input('cantidad_contada'),
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]);

            // Actualizar estado del ajuste
            $ajuste->update([
                'estado_ajuste' => 'hecho',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Ajuste aprobado correctamente',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al aprobar ajuste: ' . $e->getMessage(),
            'success' => false,
        ], 500);
    }
}



public function cancelarAjuste(Request $request)
{ 
    $id = $request->ajuste_id;
    $ajuste = InventarioAjuste::findOrFail($id);
    $ajuste->estado_ajuste = 'cancelado';
    $ajuste->save();

    return response()->json([
        'message' => 'Ajuste cancelado correctamente',
        'ajuste' => $ajuste
    ], 200);
}
}
