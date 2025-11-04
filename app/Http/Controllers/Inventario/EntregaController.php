<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\OrdenEntregaResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Inventario\InventarioOrdenEntregaCancelada;
use App\Models\Inventario\InventarioStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class EntregaController extends Controller
{
   
    public function index(Request $request)
    {
             //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

            // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');
       
        $query = QueryBuilder::for(InventarioOrdenEntrega::query()
         ->SELECT(
                'inventario_orden_entregas.*',
                'ao.nombre as origen',
                'ad.nombre as destino',
                DB::raw('CONCAT(u.name," ",u.last_name) as usuarioCreacion')
            )
            ->join('users as u', 'inventario_orden_entregas.usuario_creacion', '=', 'u.id')
            ->leftJoin('almacenes as ao', 'inventario_orden_entregas.origen_id', '=', 'ao.id')
            ->leftJoin('almacenes as ad', 'inventario_orden_entregas.destino_id', '=', 'ad.id')
            ->leftJoin('inventario_orden_entrega_canceladas as iec', 'inventario_orden_entregas.id', '=', 'iec.orden_entrega_id')
            ->where('inventario_orden_entregas.destino_id', $almacenId) 
         
         )->allowedFilters([
            AllowedFilter::callback('estado', function ($query, $value) {
                $query->where('estado', 'LIKE', "%{$value}%");
            }),

            AllowedFilter::callback('fecha_envio', function ($query, $value) {
                $query->where('inventario_orden_entregas.fecha_envio', 'LIKE', "%{$value}%");
            }),
             AllowedFilter::callback('fecha_creacion', function ($query, $value) {
                $query->where('inventario_orden_entregas.fecha_creacion', 'LIKE', "%{$value}%");
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
        ]) ->allowedSorts([
                'fecha_envio',
                'fecha_creacion',
                'estado',
                'usuarioCreacion',
                'origen',
                'destino',
            ])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();
           

        return Inertia::render('Inventario/Entregas/EntregasManagement', [
            'ordenEntregas' => OrdenEntregaResource::collection($query),
        ]);
    }


    public function confirmarEnvio(InventarioOrdenEntrega $orden)
{
    DB::transaction(function () use ($orden) {
        // Actualizar estado general
        $orden->update([
            'fecha_envio' => now(),
            'estado' => 'Enviado',
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => Auth::id(),
        ]);

        // Cargar relaciones necesarias
        $orden->load(['origen', 'destino', 'detalles.producto']);

        foreach ($orden->detalles as $detalle) {
            // Crear movimiento polimórfico
            $detalle->movimientos()->create([
                'producto_id' => $detalle->producto_id,
                'origen_id' => $orden->origen_id,
                'destino_id' => $orden->destino_id,
                'cantidad' => $detalle->cantidad_enviada,
                'tipo_movimiento' => 'orden_entrega',
                'fecha_creacion' => now(),
                'usuario_creacion' => Auth::id(),
            ]);

            // Actualizar stock (disminuye en el origen)
            InventarioStock::where('producto_id', $detalle->producto_id)
                ->where('almacen_id', $orden->origen_id)
                ->update([
                    'cantidad_actual' => DB::raw('cantidad_actual - ' . $detalle->cantidad_enviada),
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]);
        }

        // Generar remito PDF
        $this->generarRemitoPdf($orden);
    });

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


        if ($orden->recepcion) {
            $orden->recepcion->update([
                'estado' => 'Cancelado',
                'fecha_actualizacion' => now(),
                'usuario_actualizacion' => Auth::id(),
            ]);
        }

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
