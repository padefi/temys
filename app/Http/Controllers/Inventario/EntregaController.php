<?php

namespace App\Http\Controllers\Inventario;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\OrdenEntregaResource;
use App\Models\Inventario\InventarioOrdenEntrega;
use App\Models\Almacenes\Almacen;
use App\Http\Requests\Inventario\Entregas\FiltroEntregaRequest;
use Inertia\Inertia;

class EntregaController extends Controller
{
    public function index(FiltroEntregaRequest $request)
    {
        $query = InventarioOrdenEntrega::with([
            'origen:id,nombre',
            'destino:id,nombre',
            'detalles.producto:id,nombre',
            'usuarioCreacion:id,name',
        ]);

        // Filtros
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

        $entregas = $query->orderBy('fecha_creacion', 'desc')->paginate(100)->withQueryString();

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
    }
}