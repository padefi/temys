<?php

namespace Database\Factories\Ventas;

use App\Models\ControlAcceso\User;
use App\Models\General\Origen;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\solicitudVenta>
 */
class SolicitudVentaFactory extends Factory
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
            'origen_id' => Origen::inRandomOrder()->first()?->id ?? Origen::factory()->create()->id,
            'descripcion' => $this->faker->sentence,
            'estado' => $this->faker->randomElement(['Pendiente', 'Aceptada', 'Rechazada','Finalizada']),
            'usuario_id' => $user->id,
            'usuario_actualizacion' => $user->id,
        ];
    }
}
