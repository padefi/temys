<?php

namespace Database\Factories\General;

use App\Models\General\MetodoPago;
use Illuminate\Database\Eloquent\Factories\Factory;

class MetodoPagoFactory extends Factory
{
    protected $model = MetodoPago::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->unique()->randomElement([
                'Efectivo',
                'Transferencia',
                'Cheque',
                'Tarjeta',
                'Débito',
                'Crédito'
            ]),
            'descripcion' => $this->faker->sentence(),
            'habilitado' => $this->faker->boolean(),
        ];
    }
}
