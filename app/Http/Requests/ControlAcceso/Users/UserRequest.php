<?php

namespace App\Http\Requests\ControlAcceso\Users;

use App\Models\ControlAcceso\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->input('id')),
            ],
            'role' => ['required', 'string', 'exists:roles,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El Nombre es obligatorio.',
            'name.max' => 'El Apellido no puede exceder los :max caracteres.',
            'last_name.required' => 'El Apellido es obligatorio.',
            'last_name.max' => 'El Apellido no puede exceder los :max caracteres.',
            'email.required' => 'El Email es obligatorio.',
            'email.max' => 'El Email no puede exceder los :max caracteres.',
            'email.unique' => 'El Email ya se encuentra registrado.',
            'role.required' => 'El Rol es obligatorio.',
            'role.exists' => 'El Rol no existe.',
        ];
    }
}
