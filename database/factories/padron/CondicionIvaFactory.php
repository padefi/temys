<?php

namespace Database\Factories\Padron;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CondicionIvaFactory extends Factory
{
    public function definition()
    {
        $condiciones = [
            'Responsable Inscripto',
            'Monotributista',
            'Exento',
            'Consumidor Final',
            'No Responsable',
            'Responsable no Inscripto'
        ];
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'descripcion' => $this->faker->unique()->randomElement($condiciones),
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
            /* 'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $this->faker->boolean(50) ? $usuarioId : null, */
        ];
    }
}
