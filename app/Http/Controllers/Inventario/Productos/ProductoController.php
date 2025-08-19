<?php

namespace App\Http\Controllers\Inventario\Productos;

use App\Http\Controllers\Controller;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Producto::with(['modelo', 'subCategoria'])
            ->orderBy('id', 'desc')
            ->paginate(10);

       /* return inertia('General/Productos/Index', [
            'productos' => $productos,
            'flash' => [
                'success' => session('success')
            ]
        ]);*/
    }

    public function create()
    {
        return inertia('General/Productos/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modelo_id' => 'nullable|integer',
            'subcategoria_id' => 'nullable|integer',
            'peso' => 'nullable|numeric',
            'alto' => 'nullable|numeric',
            'ancho' => 'nullable|numeric',
            'volumen' => 'nullable|numeric',
            'profundidad' => 'nullable|numeric',
            'cod_barras' => 'nullable|string|max:100',
            'es_inventario' => 'boolean',
            'es_patrimonio' => 'boolean',
            'referencia' => 'nullable|string|max:100',
        ]
                                   
        Producto::create($data);

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    public function edit(Producto $producto)
    {
        return inertia('General/Productos/Edit', [
            'producto' => $producto
        ]);
    }

    public function update(Request $request, Producto $producto)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modelo_id' => 'nullable|integer',
            'subcategoria_id' => 'nullable|integer',
            'peso' => 'nullable|numeric',
            'alto' => 'nullable|numeric',
            'ancho' => 'nullable|numeric',
            'volumen' => 'nullable|numeric',
            'profundidad' => 'nullable|numeric',
            'cod_barras' => 'nullable|string|max:100',
            'es_inventario' => 'boolean',
            'es_patrimonio' => 'boolean',
            'referencia' => 'nullable|string|max:100',
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

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();
        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }
}
