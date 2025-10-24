<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\OrdenEntregaResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioOrdenEntregaCancelada;
use App\Models\Almacenes\Almacen;
use App\Http\Requests\Inventario\Entregas\FiltroEntregaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\AllowedFilter;

class EntregaController extends Controller
{
  /*    public function index(FiltroEntregaRequest $request)
    {
        $query = InventarioOrdenEntrega::with([
            'origen:id,nombre',
            'destino:id,nombre',
            'detalles.producto:id,nombre',
            'usuarioCreacion:id,name',
            'cancelacion.usuarioCreacion:id,name',
        ]);

        //Filtros
        if ($request->filled('producto')) {
            $query->whereHas('detalles.producto', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->producto . '%');
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('origen_id')) {
            $query->where('origen_id', $request->origen_id);
        }

        if ($request->filled('destino_id')) {
            $query->where('destino_id', $request->destino_id);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_creacion', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_creacion', '<=', $request->fecha_hasta);
        }

        //Ordenamiento
        $sortBy = $request->get('sort_by');
        $sortDirection = $request->get('sort_direction', 'asc');

        $sortableColumns = ['origen', 'destino', 'fecha_envio', 'estado', 'producto', 'fecha_creacion', 'usuario_creacion'];

        if (in_array($sortBy, $sortableColumns)) {
            if ($sortBy === 'producto') {
                $query->join('inventario_orden_entrega_detalles as det', 'det.orden_entrega_id', '=', 'inventario_orden_entregas.id')
                    ->join('productos as prod', 'prod.id', '=', 'det.producto_id')
                    ->orderBy('prod.nombre', $sortDirection);
            } elseif ($sortBy === 'usuario_creacion') {
                $query->join('users as u', 'u.id', '=', 'inventario_orden_entregas.usuario_creacion')
                    ->orderBy('u.name', $sortDirection);
            } elseif (in_array($sortBy, ['origen', 'destino'])) {
                $query->join('almacenes as a', 'a.id', '=', "inventario_orden_entregas.{$sortBy}_id")
                    ->orderBy('a.nombre', $sortDirection);
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        } else {
            $query->orderBy('fecha_creacion', 'desc');
        }

        $entregas = $query->paginate(100)->withQueryString();

        return Inertia::render('Inventario/Entregas/Index', [
            'entregas' => [
                'data' => OrdenEntregaResource::collection($entregas)->resolve(),
                'links' => $entregas->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $entregas->currentPage(),
                    'from' => $entregas->firstItem(),
                    'to' => $entregas->lastItem(),
                    'per_page' => $entregas->perPage(),
                    'total' => $entregas->total(),
                    'last_page' => $entregas->lastPage(),
                ],
            ],
            'filters' => $request->all(),
            'almacenes' => Almacen::select('id', 'nombre')->get(),
        ]);
    }  */
    
 public function index()
    {
        $query = InventarioOrdenEntrega::query()
          ->SELECT(
                'inventario_orden_entregas.*',
                'ao.nombre as origen',
                'ad.nombre as destino',
                'iec.motivo as cancelacion_motivo',
                DB::raw('CONCAT(u.name," ",u.last_name) as usuarioCreacion')
            )
                ->join('users as u', 'inventario_orden_entregas.usuario_creacion', '=', 'u.id')
                ->leftJoin('almacenes as ao', 'inventario_orden_entregas.origen_id', '=', 'ao.id')
                ->leftJoin('almacenes as ad', 'inventario_orden_entregas.destino_id', '=', 'ad.id')
                ->leftJoin('inventario_orden_entrega_canceladas as iec', 'inventario_orden_entregas.id', '=', 'iec.orden_entrega_id')
        ->get();      
      


        return Inertia::render('Inventario/Entregas/EntregasManagement', [
            'ordenEntregas' => OrdenEntregaResource::collection($query),
        ]);
    
     
    } 


    //Confirma el envio de la orden y genera remito
    public function confirmarEnvio(InventarioOrdenEntrega $orden)
    {
        $orden->update([
            'fecha_envio' => now(),
            'estado' => 'Enviado',
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => Auth::id(),
        ]);

        $this->generarRemitoPdf($orden);

        return response()->json(['success' => true, 'message' => 'Orden marcada como Enviada']);
    }

    //Cancela la orden de entrega
    public function cancelarOrden(Request $request, InventarioOrdenEntrega $orden)
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        $orden->update([
            'estado' => 'Cancelado',
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => Auth::id(),
        ]);

        InventarioOrdenEntregaCancelada::create([
            'orden_entrega_id' => $orden->id,
            'motivo' => $request->motivo,
            'fecha' => now(),
            'usuario' => Auth::id(),
        ]);

        return response()->json(['success' => true, 'message' => 'Orden cancelada exitosamente']);
    }

    //Obtiene el motivo de cancelación de la orden
    public function obtenerMotivoCancelacion($id)
    {
        $cancelacion = InventarioOrdenEntregaCancelada::where('orden_entrega_id', $id)->latest()->first();

        if (!$cancelacion) {
            return response()->json(['success' => false, 'message' => 'No se encontró el motivo de cancelación.']);
        }

        return response()->json(['success' => true, 'motivo' => $cancelacion->motivo]);
    }

    //Genera remito al confirmar el envio de la orden
    public function generarRemitoPdf(InventarioOrdenEntrega $orden)
    {
        //Relaciones necesarias
        $orden->load(['origen', 'destino', 'detalles.producto']);

        $mpdf = new Mpdf([
            'tempDir' => storage_path('app/tmp'),
            'default_font' => 'sans'
        ]);
        $mpdf->SetDisplayMode('fullpage');

        $html = View::make('pdf.remito', compact('orden'))->render();

        $filePath = "public/remitos/remito_{$orden->id}.pdf";
        Storage::put($filePath, $mpdf->Output('', 'S'));

        return response()->json([
            'success' => true,
            'path' => Storage::url($filePath)
        ]);
    }

}