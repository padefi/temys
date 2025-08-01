<?php

namespace App\Http\Requests\Compras;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrdenCotizacionesUpdateRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Cambia esto según tu lógica de autorización
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'razon_social' => ['required', 'string', 'max:255', Rule::unique('proveedores', 'razon_social')->ignore($this->input('id'))],
            'nombre_fantasia' => 'nullable|string|max:255',
            'padron.tipo_documento' => [
                'required',
                Rule::in(['DNI', 'Pasaporte', 'CUIT', 'CUIL', 'LE', 'LC'])
            ],
            'padron.documento' => [
                'required',
                'string', // Primero validamos que sea string
                'max:12',
                Rule::when(
                    fn() => !in_array($this->input('padron.tipo_documento'), ['Pasaporte']),
                    ['regex:/^[0-9]+$/']
                ),
                function ($attribute, $value, $fail) {
                    $tipoDocumento = $this->input('padron.tipo_documento');

                    if (in_array($tipoDocumento, ['CUIT', 'CUIL'])) {
                        $validacion = $this->validarCuitCuil($value, $tipoDocumento);
                        if (!$validacion['valid']) {
                            $fail("El $tipoDocumento no es válido. {$validacion['message']}");
                            return;
                        }
                    }

                    if ($tipoDocumento === 'DNI') {
                        if (strlen($value) < 7 || strlen($value) > 8) {
                            $fail('El DNI debe tener entre 7 y 8 dígitos');
                            return;
                        }
                    }

                }
            ],
            'padron.nacionalidad' => 'nullable|string|max:100'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Opcional: puedes transformar los datos antes de validar
        $this->merge([
            'padron.tipo_documento' => strtoupper($this->input('padron.tipo_documento'))
        ]);
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'razon_social.required' => 'La razón social es obligatoria',
            'razon_social.unique' => 'La razón social ya está registrada',
            'padron.tipo_documento.in' => 'El tipo de documento seleccionado no es válido',
            'padron.documento.required' => 'El número de documento es obligatorio',
            'padron.documento.max' => 'El documento no debe superar los 12 caracteres',
            'padron.documento.regex' => 'El documento debe contener solo números',


            // Agrega más mensajes personalizados según necesites
        ];
    }
}
