<?php

namespace Database\Factories\Compras;


use App\Models\ControlAcceso\User;
use App\Models\General\Origen;
use Illuminate\Database\Eloquent\Factories\Factory;

class SolicitudCompraFactory extends Factory
{
    public function definition(): array
    {
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'origen_id' => Origen::inRandomOrder()->first()?->id ?? Origen::factory()->create()->id,
            'descripcion' => $this->faker->sentence,
            'estado' => $this->faker->randomElement(['Pendiente', 'Aceptada', 'Rechazada']),
            'usuario_id' => $user->id,
            'usuario_actualizacion' => $user->id,
        ];
    }
}
