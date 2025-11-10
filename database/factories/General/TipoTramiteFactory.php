<?php

namespace Database\Factories\General;

use Illuminate\Database\Eloquent\Factories\Factory;

class TipoTramiteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->randomElement(['Orden de compra', 'Beneficios', 'Impuestos', 'Servicios']),
            'descripcion' => $this->faker->sentence(),
        ];
    }
}
