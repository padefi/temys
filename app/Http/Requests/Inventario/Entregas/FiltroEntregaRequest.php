<?php

namespace App\Http\Requests\Inventario\Entregas;

use Illuminate\Foundation\Http\FormRequest;

class FiltroEntregaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'producto'      => ['nullable', 'string'],
            'estado'        => ['nullable', 'string'],
            'origen_id'     => ['nullable', 'numeric', 'exists:almacenes,id'],
            'destino_id'    => ['nullable', 'numeric', 'exists:almacenes,id'],
            'fecha_desde'   => ['nullable', 'date'],
            'fecha_hasta'   => ['nullable', 'date', 'after_or_equal:fecha_desde'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_hasta.after_or_equal' => 'La fecha "hasta" debe ser posterior o igual a la fecha "desde".',
            'origen_id.exists' => 'El almacén de origen no es válido.',
            'destino_id.exists' => 'El almacén de destino no es válido.',
        ];
    }
}
