<?php

namespace Database\Factories\Contabilidad;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MotivoNotaCredito>
 */
class MotivoNotaDebitoFactory extends Factory
{
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
