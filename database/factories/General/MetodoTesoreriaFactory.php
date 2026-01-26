<?php

namespace Database\Factories\General;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\General\MetodoTesoreria;
use Illuminate\Database\Eloquent\Factories\Factory;

class MetodoPagoFactory extends Factory
{
    protected $model = MetodoTesoreria::class;

    public function definition()
    {
        return [

            'tipo' => $this->faker->randomElement(['Pago', 'Cobro']),
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
            'co_cuenta_id' => Cuenta::inRandomOrder()->first()->id ?? Cuenta::factory(),
        ];
    }
}
