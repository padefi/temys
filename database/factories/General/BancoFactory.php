<?php

// database/factories/CuentaBancariaFactory.php
namespace Database\Factories\General;

use App\Models\General\Banco;
use Illuminate\Database\Eloquent\Factories\Factory;

class BancoFactory extends Factory
{
    protected $model = Banco::class;

    public function definition(): array {
        return [
            'banco' => $this->faker->company,
            'sucursal' => $this->faker->city,
            'codigo_sucursal' => $this->faker->numerify('###'),
            'direccion' => $this->faker->address,
            'telefono' => $this->faker->phoneNumber,
            'contacto' => $this->faker->name,
            'mail' => $this->faker->safeEmail,
            'observaciones' => $this->faker->sentence,
        ];
    }
}

