<?php

namespace Database\Factories\Padron;;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\PadronCbu;
use Illuminate\Database\Eloquent\Factories\Factory;

class PadronCbuFactory extends Factory
{
    protected $model = PadronCbu::class;

    public function definition(): array
    {
        return [
            'tipo' => $this->faker->randomElement(['cliente', 'proveedor']),
            'tipo_id' => Proveedor::factory(),
            'tipo_clave' => $this->faker->randomElement(['cbu', 'cvu']),
            'clave' => $this->faker->numerify('######################'), // 22 dígitos
            'alias' => $this->faker->word(),
            'banco' => $this->faker->company(),
            'tipo_cuenta' => $this->faker->randomElement(['Caja de ahorro', 'Cuenta corriente']),
            'predeterminado' => $this->faker->boolean(20),
        ];
    }
}
