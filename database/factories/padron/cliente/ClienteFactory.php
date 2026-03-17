<?php

namespace Database\Factories\Padron\Cliente;

use App\Models\Padron\Padron;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    public function definition()
    {
        // Asegurarse de que existan registros en padron
        $padron = Padron::inRandomOrder()->first() ?? Padron::factory()->create();
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_padron' => $padron->id,
            'apellido' => $this->faker->lastName,
            'nombre' => $this->faker->firstName,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
            /* 'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $this->faker->boolean(50) ? $usuarioId : null, */
        ];
    }
}
