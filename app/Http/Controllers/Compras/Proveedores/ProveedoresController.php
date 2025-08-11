<?php

namespace App\Http\Controllers\Compras\Proveedores;
use App\Http\Requests\Compras\ProveedorUpdateRequest;
use App\Http\Controllers\Controller;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProveedoresController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/Proveedores/Index', [
            'proveedores' => [
            'data' => Proveedor::with('padron')->get() // Estructura que espera el frontend
            ],
            //'module' => '3',
        ]);
    }

    public function update(ProveedorUpdateRequest $request, Proveedor $proveedor)
    {

        try {
         // Los datos ya están validados cuando llegan aquí
        $validated = $request->validated();

        // Actualizar proveedor
        // Actualizar
        $proveedor->update($validated);

        // Actualizar padrón si existe
        if ($proveedor->padron) {
        $proveedor->padron()->update($validated['padron']);
        } else {
            $proveedor->padron()->create($validated['padron']);
        }

        return redirect()->back()->with('success', 'Proveedor actualizado');


        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()])
                ->withInput();
        }
    }
}
