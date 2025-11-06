<?php

namespace Database\Factories\General;

use App\Models\General\CondicionVenta;
use Illuminate\Database\Eloquent\Factories\Factory;

class CondicionVentaFactory extends Factory
{
    protected $model = CondicionVenta::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->randomElement([
                'Contado', 'Financiado', 'Cheque', 'Tarjeta', 'Transferencia'
            ]),
            'descripcion' => $this->faker->sentence(5),
        ];
    }
}
