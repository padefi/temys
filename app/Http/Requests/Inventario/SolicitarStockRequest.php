<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class SolicitarStockRequest extends FormRequest
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
            'solicitudes' => 'required|array|min:1',
            'solicitudes.*.producto_id' => 'required|integer|exists:productos,id',
            'solicitudes.*.almacen_solicitante_id' => 'required|integer|exists:almacenes,id',
            'solicitudes.*.almacen_proveedor_id' => 'required|integer|exists:almacenes,id',
            'solicitudes.*.cantidad' => 'required|integer|min:1',
            'solicitudes.*.prioridad' => 'required|string|in:Alta,Media,Baja',
            'solicitudes.*.motivo' => 'nullable|string|max:255',
        ];
    }
}
