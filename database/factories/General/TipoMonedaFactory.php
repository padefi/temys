<?php

namespace Database\Factories\General;

use App\Models\General\TipoMoneda;
use Illuminate\Database\Eloquent\Factories\Factory;

class TipoMonedaFactory extends Factory
{
    protected $model = TipoMoneda::class;

    public function definition(): array
    {
        return [
            'codigo' => strtoupper($this->faker->unique()->currencyCode), // ej: USD
            'descripcion' => $this->faker->randomElement([
                            'Dólar estadounidense',
                            'Euro',
                            'Peso argentino',
                            'Real brasileño',
                            'Yen japonés',
                            'Libra esterlina',
                        ]),
            'simbolo' => $this->faker->randomElement(['$', '€', '¥', '£']),
            'pais_origen' => $this->faker->country,
        ];
    }
}
