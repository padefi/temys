<?php
namespace App\Http\Controllers\Inventario\Operaciones;
use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\RecepcionesResource;
use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Inventario\InventarioRecepcionCancelada;
use App\Models\Inventario\InventarioRecepcionProducto;
use App\Models\Inventario\InventarioRecepcionProductoDetalle;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecepcionesController extends Controller
{
    public function index(Request $request)
    {
           //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

            // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');
         

        $recepciones = QueryBuilder::for(
            InventarioRecepcionProducto::query()
                ->SELECT(
                    'inventario_recepcion_productos.*',
                    'ao.nombre as origen',
                    'ad.nombre as destino',
                    DB::raw('CONCAT(u.name," ",u.last_name) as usuarioCreacion')
                )
                ->join('users as u', 'inventario_recepcion_productos.usuario_creacion', '=', 'u.id')
                ->leftJoin('almacenes as ao', 'inventario_recepcion_productos.origen_id', '=', 'ao.id')
                ->leftJoin('almacenes as ad', 'inventario_recepcion_productos.destino_id', '=', 'ad.id')
                 ->where('inventario_recepcion_productos.origen_id', $almacenId)
        )->allowedFilters([
            AllowedFilter::callback('estado', function ($query, $value) {
                $query->where('estado', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('fecha_recepcion', function ($query, $value) {
                $query->where('inventario_recepcion_productos.fecha_recepcion', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('tipo_recepcion', function ($query, $value) {
                $query->where('inventario_recepcion_productos.tipo_recepcion', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('origen', function ($query, $value) {
                $query->where('ao.nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('destino', function ($query, $value) {
                $query->where('ad.nombre', 'LIKE', "%{$value}%");
            }),
            AllowedFilter::callback('usuarioCreacion', function ($query, $value) {
                $query->whereRaw("CONCAT(u.name, ' ', u.last_name) LIKE ?", ["%{$value}%"]);
            }),
            AllowedFilter::partial('cantidad_actual'),
        ])
            ->allowedSorts([
                'fecha_recepcion',
                'tipo_recepcion',
                'estado',
                'usuarioCreacion',
                'origen',
                'destino',
            ])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('Inventario/Recepciones/RecepcionesManagement', [
            'recepcionProductos' => RecepcionesResource::collection($recepciones),
        ]);
    }

    // RecepcionController.php
    public function ControlRecepcion(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            foreach ($request->productos as $detalle) {
                $cantidadContada = $detalle['cantidad_contada'];

                // Crear movimiento
                InventarioMovimientoStock::create([
                    'producto_id' => $detalle['producto_id'],
                    'origen_id' => $recepcion->origen_id,
                    'destino_id' => $recepcion->destino_id,
                    'cantidad' => $cantidadContada,
                    'tipo_movimiento' => 'reposicion',
                    'fecha_creacion' => now(),
                    'usuario_creacion' => Auth::id(),
                ]);

                // Actualizar stock
                InventarioStock::where('producto_id', $detalle['producto_id'])
                    ->where('almacen_id', $recepcion->origen_id)
                    ->update([
                        'cantidad_actual' => DB::raw('cantidad_actual + ' . (int) $cantidadContada),
                        'usuario_actualizacion' => Auth::id(),
                        'fecha_actualizacion' => now(),
                    ]);
            }

            // Actualizar cantidades recibidas en los detalles
            foreach ($recepcion->detalles as $detalle) {
                $productoRequest = collect($request->productos)
                    ->firstWhere('producto_id', $detalle->producto_id);

                if ($productoRequest) {
                    $detalle->cantidad_recibida = $productoRequest['cantidad_contada'];
                    $detalle->estado = $productoRequest['estado'];

                    $detalle->save();
                }
            }

            // Cambiar estado general de la recepción
            $recepcion->update([
                'estado' => 'completa',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);
        });

        return response()->json(['message' => 'Recepción aceptada correctamente.']);
    }


    public function cancelar(Request $request)
    {
        DB::transaction(function () use ($request) {
            $recepcion = InventarioRecepcionProducto::with(['detalles', 'origen', 'destino'])
                ->findOrFail($request->recepcion_id);

            $recepcion->update([
                'estado' => 'Cancelado',
                'usuario_actualizacion' => Auth::id(),
                'fecha_actualizacion' => now(),
            ]);

            InventarioRecepcionCancelada::create([
                'recepcion_id' => $recepcion->id,
                'motivo' => $request->motivo,
                'fecha' => now(),
                'usuario' => Auth::id(),
            ]);

            $ordenRecepcion = InventarioRecepcionProducto::create([
                'origen_id' => $recepcion->destino_id,
                'destino_id' => $recepcion->origen_id,
                'orden_entrega_id' => null,
                'tipo_recepcion' => 'restitucion',
                'fecha_recepcion' => now(),
                'estado' => 'Pendiente',
                'usuario_creacion' => Auth::id(),
            ]);

            foreach ($recepcion->detalles as $producto) {
                InventarioRecepcionProductoDetalle::insert([
                    'recepcion_id' => $ordenRecepcion->id,
                    'producto_id' => $producto->producto_id,
                    'cantidad_esperada' => abs($producto->cantidad_esperada),
                ]);
            }
        });

        return response()->json(['message' => 'Recepción cancelada correctamente.']);
    }
}
