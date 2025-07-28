<?php

namespace Database\Factories\General;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImpuestoFactory extends Factory
{
    protected $model = Impuesto::class;

    public function definition(): array
    {
        return [
            'descripcion' => $this->faker->word(),
            'porcentaje' => $this->faker->randomFloat(2, 0.01, 25),
            'habilitado' => $this->faker->boolean(90),
        ];
    }
}
