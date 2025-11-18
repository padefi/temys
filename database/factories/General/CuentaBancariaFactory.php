<?php

namespace Database\Factories\General;

use App\Models\General\CuentaBancaria;
use App\Models\General\Banco;
use Illuminate\Database\Eloquent\Factories\Factory;

class CuentaBancariaFactory extends Factory
{
    protected $model = CuentaBancaria::class;

    public function definition()
    {
        return [
            'banco_id' => Banco::inRandomOrder()->first()->id ?? Banco::factory(),
            'numero_cuenta' => $this->faker->bankAccountNumber(),
            'activo' => $this->faker->boolean(90), // 90% chance de estar activo
            'tipo_cuenta' => $this->faker->randomElement([
                'Caja de Ahorro Pesos',
                'Caja de Ahorro Dólares',
                'Cuenta Corriente',
            ]),
        ];
    }
}
