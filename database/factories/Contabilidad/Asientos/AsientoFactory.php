<?php

namespace Database\Factories\Contabilidad\Asientos;

use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AsientoFactory extends Factory
{
    protected $model = Asiento::class;

    public function definition(): array
    {
        return [
            'numero' => $this->faker->unique()->numberBetween(1, 999999),

            'co_ejercicio_id' => Ejercicio::inRandomOrder()->value('id')
                ?? Ejercicio::factory(),

            'fecha' => $this->faker->date(),

            'concepto' => $this->faker->sentence(4),

            'importe' => $this->faker->randomFloat(2, 10, 50000), // (decimales, min, max)

            'estado' => $this->faker->randomElement([
                'PENDIENTE',
                'CONTROLADO',
            ]),

            'model_id_created' => User::inRandomOrder()->value('id'),
            'created_at'       => now(),

            'model_id_updated' => null,
            'updated_at'       => null,

            'model_id_confirmed' => null,
            'confirmed_at'       => null,

            'model_id_voided' => null,
            'voided_at'       => null,
        ];
    }

    /* ===== States útiles ===== */

    public function controlado(): static
    {
        return $this->state(fn () => [
            'estado' => 'CONTROLADO',
            'model_id_confirmed' => User::inRandomOrder()->value('id'),
            'confirmed_at' => now(),
        ]);
    }

    public function anulado(): static
    {
        return $this->state(fn () => [
            'estado' => 'ANULADO',
            'model_id_voided' => User::inRandomOrder()->value('id'),
            'voided_at' => now(),
        ]);
    }
}
