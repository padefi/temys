<?php

namespace Database\Factories\General;

use App\Models\General\Origen;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrigenFactory extends Factory
{
    protected $model = Origen::class;

    public function definition(): array
    {
        return [
            'descripcion' => $this->faker->word(),
        ];
    }
}
