<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Padron;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProveedorFactory extends Factory
{
    public function definition()
    {
        // Asegurarse de que existan registros en padron
        $padron = Padron::inRandomOrder()->first() ?? Padron::factory()->create();

        return [
            'id_padron' => $padron->id,
            'razon_social' => $this->faker->company,
            'nombre_fantasia' => $this->faker->company,
        ];
    }
}
