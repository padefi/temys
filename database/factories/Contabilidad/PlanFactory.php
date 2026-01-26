<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanFactory extends Factory
{

    protected $model = Plan::class;

    public function definition(): array
    {
        $tipo = $this->faker->randomElement(['unico', 'cuotas']);
        return [
            'tipo' => $tipo,
            'cantidad_cuotas' => $tipo === 'cuotas' ? $this->faker->numberBetween(2, 6) : null,
        ];
    }
}
