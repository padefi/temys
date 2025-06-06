<?php

namespace Database\Factories;

use App\Models\Padron;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    public function definition()
    {
        // Asegurarse de que existan registros en padron
        $padron = Padron::inRandomOrder()->first() ?? Padron::factory()->create();

        return [
            'id_padron' => $padron->id,
            'apellido' => $this->faker->lastName,
            'nombre' => $this->faker->firstName,
        ];
    }
}
