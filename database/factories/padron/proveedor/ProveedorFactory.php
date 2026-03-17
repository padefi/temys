<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Padron;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProveedorFactory extends Factory
{
    public function definition()
    {
        // Asegurarse de que existan registros en padron
        $padron = Padron::inRandomOrder()->first() ?? Padron::factory()->create();
        $tipoProveedor = ['Humana', 'Jurídica'];
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_padron' => $padron->id,
            'razon_social' => $this->faker->company,
            'nombre_fantasia' => $this->faker->company,
            'tipo' => $this->faker->randomElement($tipoProveedor),
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
            /* 'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $this->faker->boolean(50) ? $usuarioId : null, */
        ];
    }
}
