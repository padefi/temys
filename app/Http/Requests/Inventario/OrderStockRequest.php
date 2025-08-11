<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class OrderStockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'producto_id' => 'required|exists:productos,id',
            'almacen_solicitante_id' => 'required|exists:almacenes,id',
            'almacen_proveedor_id' => 'required|exists:almacenes,id',
            'cantidad' => 'required|integer|min:1',
            'prioridad' => 'required|string|max:50',
            'motivo' => 'nullable|string|max:255',
        ];
    }
} 
