<?php

namespace App\Http\Controllers\Inventario\Productos;

/*use App\Http\Resources\ControlAcceso\SubmenuResource;
use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\Submenu;
use App\Models\ControlAcceso\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;*/

use App\Http\Controllers\Controller;
use App\Models\Inventario\Productos\Producto;
use App\Models\Inventario\Productos\ProductoModelo;
use App\Models\Inventario\Productos\ProductoSubcategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::query();

        // Filtros
        if ($request->filled('filters.nombre')) {
            $query->where('nombre', 'like', '%' . $request->input('filters.nombre') . '%');
        }

        if ($request->filled('filters.modelo_id')) {
            $query->where('modelo_id', $request->input('filters.modelo_id'));
        }

        if ($request->filled('filters.subcategoria_id')) {
            $query->where('subcategoria_id', $request->input('filters.subcategoria_id'));
        }

        // Orden
        if ($request->filled('sort')) {
            $sortField = ltrim($request->sort, '-');
            $direction = str_starts_with($request->sort, '-') ? 'desc' : 'asc';
            $query->orderBy($sortField, $direction);
        }

        $productos = $query->paginate(10)->appends($request->all());

        return Inertia::render('Inventario/Productos/page', [
            'productos' => $productos,
            'modelos' => ProductoModelo::select('id', 'descripcion as nombre')->get(),
            'subcategorias' => ProductoSubcategoria::select('id', 'descripcion as nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modelo_id' => 'nullable|integer|exists:producto_modelos,id',
            'subcategoria_id' => 'nullable|integer|exists:producto_subcategorias,id',
            'peso' => 'nullable|numeric',
            'alto' => 'nullable|numeric',
            'ancho' => 'nullable|numeric',
            'volumen' => 'nullable|numeric',
            'profundidad' => 'nullable|numeric',
            'cod_barras' => 'nullable|string|max:100',
            'referencia' => 'nullable|string|max:100',
            'es_inventario' => 'boolean',
            'es_patrimonio' => 'boolean',
        ]);

        $producto = Producto::create([
            ...$request->only([
                'nombre', 'descripcion', 'modelo_id', 'subcategoria_id',
                'peso', 'alto', 'ancho', 'volumen', 'profundidad',
                'cod_barras', 'referencia', 'es_inventario', 'es_patrimonio'
            ]),
            'fecha_creacion' => Carbon::now(),
            'fecha_actualizacion' => Carbon::now(),
            'usuario_creacion' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Producto creado correctamente',
            'producto' => $producto,
        ]);
    }

    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modelo_id' => 'nullable|integer|exists:producto_modelos,id',
            'subcategoria_id' => 'nullable|integer|exists:producto_subcategorias,id',
            'peso' => 'nullable|numeric',
            'alto' => 'nullable|numeric',
            'ancho' => 'nullable|numeric',
            'volumen' => 'nullable|numeric',
            'profundidad' => 'nullable|numeric',
            'cod_barras' => 'nullable|string|max:100',
            'referencia' => 'nullable|string|max:100',
            'es_inventario' => 'boolean',
            'es_patrimonio' => 'boolean',
        ]);

        $producto->update([
            ...$request->only([
                'nombre', 'descripcion', 'modelo_id', 'subcategoria_id',
                'peso', 'alto', 'ancho', 'volumen', 'profundidad',
                'cod_barras', 'referencia', 'es_inventario', 'es_patrimonio'
            ]),
            'fecha_actualizacion' => Carbon::now(),
            'usuario_actualizacion' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado correctamente',
            'producto' => $producto->fresh(), // devuelve datos actualizados
        ]);
    }
}