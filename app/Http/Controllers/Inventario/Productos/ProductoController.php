<?php

namespace App\Http\Controllers\Inventario\Productos;

use App\Http\Controllers\Controller;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\Inventario\Productos\Producto;
use App\Models\Inventario\Productos\ProductoModelo;
use App\Models\Inventario\Productos\ProductoSubcategoria;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductoController extends Controller
{
    protected function getModuleFromRequest(Request $request)
    {
        // Si la ruta es: compras/productos o contabilidad/productos
        $prefix = explode('/', $request->path())[0] ?? 'inventario';
        return strtolower($prefix);
    }



    public function index(Request $request)
    {
        $modulo = $this->getModuleFromRequest($request);

        $productos = Producto::with(['modelo', 'subCategoria'])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return inertia('General/Productos/Index', [
            'productos' => $productos,
            'modulo' => $modulo,
            'flash' => ['success' => session('success')],
        ]);
    }

    public function create(Request $request)
    {
        $modulo = $this->getModuleFromRequest($request);

        return inertia('General/Productos/Create', [
            'modulo' => $modulo,
        ]);
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
            'co_cuenta_id' => 'nullable|integer',
        ]);

        // Agregar valores extra
        $data['fecha_creacion'] = now();
        $data['usuario_creacion'] = Auth::id();
        $data['fecha_actualizacion'] = null;
        $data['usuario_actualizacion'] = null;

        Producto::create($data);

        $modulo = $this->getModuleFromRequest($request);

         $productos = Producto::with(['modelo', 'subCategoria'])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return inertia('General/Productos/Index', [
            'modulo' => $modulo,
            'productos' => $productos,
            'flash' => ['success' => session('success')],
        ]);
    }


    public function edit(Request $request, Producto $producto)
    {
        $modulo = $this->getModuleFromRequest($request);

         return inertia('General/Productos/Edit', [
            'modulo' => $modulo,
            'producto' => $producto,
            'flash' => ['success' => session('success')],
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
            'co_cuenta_id' => 'nullable|integer',
        ]);



        $producto->update([
            ...$data,
            'fecha_actualizacion' => Carbon::now(),
            'usuario_actualizacion' => Auth::id(),
        ]);

        $modulo = $this->getModuleFromRequest($request);

        $productos = Producto::with(['modelo', 'subCategoria'])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return inertia('General/Productos/Index', [
            'modulo' => $modulo,
            'productos' => $productos,
            'flash' => ['success' => session('success')],
        ]);
    }

    public function destroy(Request $request, Producto $producto)
    {
        $producto->delete();
        $modulo = $this->getModuleFromRequest($request);



         $productos = Producto::with(['modelo', 'subCategoria'])
            ->orderBy('id', 'desc')
            ->paginate(10);

        return inertia('General/Productos/Index', [
            'modulo' => $modulo,
            'productos' => $productos,
            'flash' => ['success' => session('success')],
        ]);
    }

    public function modelos()
    {
        return ProductoModelo::all();
    }

    public function subCategorias()
    {
        return ProductoSubcategoria::all();
    }
}
