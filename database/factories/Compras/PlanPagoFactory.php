<?php

namespace Database\Factories\Compras;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlanPagoFactory extends Factory
{
    public function definition(): array
    {
        $tipo = $this->faker->randomElement(['unico', 'cuotas']);
        return [
            'tipo_pago' => $tipo,
            'cantidad_cuotas' => $tipo === 'cuotas' ? $this->faker->numberBetween(2, 6) : null,
        ];
    }
}
