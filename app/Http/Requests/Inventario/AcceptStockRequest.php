<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class AcceptStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'solicitud_id' => 'required|exists:inventario_solicitar_stocks,id',
            'motivo' => 'required|string|max:500',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad_aprobada' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'solicitud_id.required' => 'La solicitud es obligatoria.',
            'solicitud_id.exists' => 'La solicitud no existe.',
            'motivo.required' => 'El motivo es obligatorio.',
            'productos.required' => 'Debes enviar al menos un producto.',
            'productos.*.producto_id.required' => 'Falta el ID del producto.',
            'productos.*.producto_id.exists' => 'El producto no existe.',
            'productos.*.cantidad_aprobada.required' => 'Falta la cantidad aprobada.',
            'productos.*.cantidad_aprobada.numeric' => 'La cantidad debe ser numérica.',
            'productos.*.cantidad_aprobada.min' => 'La cantidad no puede ser negativa.',
        ];
    }
}
