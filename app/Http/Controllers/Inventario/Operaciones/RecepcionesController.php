<?php

namespace App\Http\Controllers\Inventario\Operaciones;

use App\Http\Controllers\Controller;
use App\Http\Resources\Inventario\RecepcionesResource;
use App\Models\Inventario\InventarioRecepcionProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecepcionesController extends Controller
{
     public function index() {
        //  Tomo el branch_id activo desde la sesión      
        $branchId = Session::get('active_branch_id') ?? null;

        // Si necesitas el almacen correspondiente a ese branch
        $almacenId = DB::table('almacenes')
            ->where('id', $branchId)
            ->value('id');

            



        $recepciones=QueryBuilder::for(
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
        )
        ->allowedFilters([
            AllowedFilter::exact('origen_id'),
            AllowedFilter::exact('destino_id'),
            AllowedFilter::exact('tipo_recepcion'),
            AllowedFilter::exact('estado'),
        ])->get();      





        return Inertia::render('Inventario/Recepciones/RecepcionesManagement', [
            'recepcionProductos' => RecepcionesResource::collection($recepciones),
        ]);
    
    
    }}
    