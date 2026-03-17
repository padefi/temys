<?php

namespace App\Http\Requests\Contabilidad;

use App\Enums\Contabilidad\EstadoAsiento;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class AsientoRequest extends FormRequest
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
            'numero' => ['nullable', 'numeric'],
            'ejercicio' => ['required', 'exists:co_ejercicios,id'],
            'fecha' => ['required', 'date'],
            'concepto' => ['required', 'string', 'max:255'],
            'importe' => ['required', 'numeric', 'min:0'],
            'estado' => ['required', new Enum(EstadoAsiento::class)],
            'partidas' => ['required', 'array', 'min:2'],
            'partidas.*.cuenta.id' => ['required', 'exists:co_cuentas,id'],
            'partidas.*.debe' => ['required', 'numeric', 'min:0'],
            'partidas.*.haber' => ['required', 'numeric', 'min:0'],
            'partidas.*.concepto' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'numero.required' => 'El número de asiento es obligatorio.',
            'ejercicio.required' => 'Debe seleccionar un ejercicio contable válido.',
            'ejercicio.exists' => 'El ejercicio seleccionado no existe.',
            'fecha.required' => 'La fecha del asiento es obligatoria.',
            'fecha.date' => 'El formato de la fecha es inválido.',
            'concepto.required' => 'El concepto del asiento es obligatorio.',
            'importe.required' => 'El importe total es obligatorio.',
            'estado.required' => 'El estado del asiento es obligatorio.',
            'estado.Illuminate\Validation\Rules\Enum' => 'El estado seleccionado no es válido (Debe ser PENDIENTE, CONTROLADO o ANULADO).',

            'partidas.required' => 'Debe incluir partidas en el asiento.',
            'partidas.array' => 'El formato de las partidas es incorrecto.',
            'partidas.min' => 'El asiento debe tener al menos :min partidas para ser válido.',

            'partidas.*.cuenta.id.required' => 'La cuenta es obligatoria.',
            'partidas.*.cuenta.id.exists' => 'La cuenta seleccionada no es válida.',
            'partidas.*.debe.required' => 'El importe al debe es obligatorio.',
            'partidas.*.debe.numeric' => 'El debe debe ser un valor numérico.',
            'partidas.*.haber.required' => 'El importe al haber es obligatorio.',
            'partidas.*.haber.numeric' => 'El haber debe ser un valor numérico.',
        ];
    }

    public function attributes(): array
    {
        $attributes = [
            'numero' => 'número de asiento',
            'ejercicio' => 'ejercicio contable',
            'concepto' => 'concepto general',
        ];

        if ($this->has('partidas'))
        {
            foreach ($this->get('partidas') as $key => $val)
            {
                $index = $key + 1;
                $attributes["partidas.{$key}.cuenta.id"] = "cuenta en la fila {$index}";
                $attributes["partidas.{$key}.debe"] = "debe en la fila {$index}";
                $attributes["partidas.{$key}.haber"] = "haber en la fila {$index}";
            }
        }

        return $attributes;
    }
}
