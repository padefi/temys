<?php

namespace App\Http\Controllers\Ventas\Clientes;
use App\Http\Requests\Compras\ProveedorUpdateRequest;
use App\Http\Controllers\Controller;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\ProveedorCbu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientesController extends Controller
{
    ////LISTAR CLIENTES
    public function index()
    {
        return Inertia::render('Ventas/Clientes/Index', [
            'clientes' => [
            'data' => Cliente::with('padron')->get() // Estructura que espera el frontend
            ],
            //'module' => '3',
        ]);
    }

    ////ACTUALIZAR CLIENTE
    public function update(ProveedorUpdateRequest $request, Cliente $cliente)
    {

        try {
         // Los datos ya están validados cuando llegan aquí
        $validated = $request->validated();

        // Actualizar cliente
        // Actualizar
        $cliente->update($validated);

        // Actualizar padrón si existe
        if ($cliente->padron) {
        $cliente->padron()->update($validated['padron']);
        } else {
            $cliente->padron()->create($validated['padron']);
        }

        return redirect()->back()->with('success', 'Cliente actualizado');


        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()])
                ->withInput();
        }
    }

    ////LISTAR CBU DE CLIENTE
    public function cbus($clienteId)
    {
        $cliente = Cliente::findOrFail($clienteId);
        $cbus = $cliente->cbu()->select('id', 'cbu', 'alias')->get();
        return response()->json($cbus);
    }

}
