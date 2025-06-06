<?php

namespace Database\Factories;

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

        return [
            'descripcion' => $this->faker->unique()->randomElement($condiciones)
        ];
    }
}
