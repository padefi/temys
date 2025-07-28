<?php

namespace Database\Factories\Compras\OrdenCotizacion;

use App\Models\ControlAcceso\User;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\General\TipoMoneda;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCotizacionFactory extends Factory
{
    public function definition(): array
    {
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'proveedor_id' => Proveedor::inRandomOrder()->value('id') ?? Proveedor::factory(),
            'moneda_id' => TipoMoneda::inRandomOrder()->value('id') ?? TipoMoneda::factory(),
            'cotizar_antes_de' => $this->faker->dateTimeBetween('now', '+10 days'),
            'entrega_esperada' => $this->faker->dateTimeBetween('+10 days', '+30 days'),
            'entregar_a' => $this->faker->company,
            'observaciones' => $this->faker->sentence(8),
            'estado' => $this->faker->randomElement(['Pendiente', 'Confirmada', 'Cancelada']),
            'usuario_id' => $user->id,
            'usuario_actualizacion' => $user->id,
        ];
    }
}
