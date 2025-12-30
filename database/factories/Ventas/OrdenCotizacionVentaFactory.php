<?php

namespace Database\Factories\Ventas;

use App\Models\ControlAcceso\User;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ordenCotizacionVenta>
 */
class OrdenCotizacionVentaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'cliente_id' => Cliente::inRandomOrder()->value('id') ?? Cliente::factory(),
            'moneda_id' => TipoMoneda::inRandomOrder()->value('id') ?? TipoMoneda::factory(),
            'cotizar_antes_de' => $this->faker->dateTimeBetween('now', '+10 days'),
            'entrega_esperada' => $this->faker->dateTimeBetween('+10 days', '+30 days'),
            'observaciones' => $this->faker->sentence(8),
            'estado' => $this->faker->randomElement(['Pendiente', 'Confirmada', 'Cancelada']),
            'usuario_id' => $user->id,
            'usuario_actualizacion' => $user->id,
        ];
    }
}
