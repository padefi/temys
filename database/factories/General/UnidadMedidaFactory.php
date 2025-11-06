<?php

namespace Database\Factories\General;

use Illuminate\Database\Eloquent\Factories\Factory;

class UnidadMedidaFactory extends Factory
{
    public function definition(): array
    {
        $nombres = ['Unidad', 'Kilogramo', 'Litro', 'Metro', 'Caja', 'Paquete'];
        $nombre = $this->faker->unique()->randomElement($nombres);
        return [
            'codigo' => strtoupper(substr($nombre, 0, 3)),
            'nombre' => $nombre,
            'descripcion' => $this->faker->sentence(4),
        ];
    }
}
