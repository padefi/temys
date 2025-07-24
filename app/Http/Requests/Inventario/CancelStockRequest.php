<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;

class CancelStockRequest extends FormRequest
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
           'solicitud_id' => 'required|exists:inventario_solicitar_stocks,id',
            'estado' => 'required|in:Pendiente,Aceptada,Cancelada',
            'motivo' => 'nullable|string',
        ];
    }
}
