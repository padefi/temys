<?php

namespace Database\Factories\Contabilidad;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MotivoReembolso>
 */
class MotivoReembolsoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         return [
            'codigo' => strtoupper($this->faker->unique()->lexify('MOTIVO_????')),
            'descripcion' => $this->faker->sentence(4),
            'categoria' => $this->faker->randomElement([
                'error',
                'devolucion',
                'ajuste',
                'financiero',
                'administrativo',
            ]),
            'activo' => true,
        ];
    }
}
