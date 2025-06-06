<?php

namespace Database\Factories\Padron;

use Illuminate\Database\Eloquent\Factories\Factory;

class PadronFactory extends Factory
{
    public function definition()
    {
        $tiposDocumento = ['DNI', 'Pasaporte', 'Cédula', 'LC', 'LE','CUIT','CUIL'];

        return [
            'tipo_documento' => $this->faker->randomElement($tiposDocumento),
            'documento' => $this->faker->unique()->numerify('########'),
            'nacionalidad' => $this->faker->optional(0.7)->country,
        ];
    }
}
