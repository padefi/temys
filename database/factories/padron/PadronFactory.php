<?php

namespace Database\Factories\Padron;

use App\Models\ControlAcceso\User;
use App\Models\General\Nacionalidad;
use Illuminate\Database\Eloquent\Factories\Factory;

class PadronFactory extends Factory
{
    public function definition()
    {
        $tiposDocumento = ['DNI', 'Pasaporte', 'Cédula', 'LC', 'LE','CUIT','CUIL'];
        $usuarioId = User::inRandomOrder()->value('id');
        $nacionalidadId = Nacionalidad::inRandomOrder()->value('id');

        return [
            'tipo_documento' => $this->faker->randomElement($tiposDocumento),
            'documento' => $this->faker->unique()->numerify('########'),
            'nacionalidad' => $this->faker->boolean(70) ? $nacionalidadId : null,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
