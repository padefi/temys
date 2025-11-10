<?php

namespace Database\Factories\Padron\Proveedor;;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ProveedorCbu;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProveedorCbuFactory extends Factory
{
    protected $model = ProveedorCbu::class;

    public function definition(): array
    {
        return [
            'proveedor_id' => Proveedor::factory(),
            'cbu' => $this->faker->numerify('######################'), // 22 dígitos
            'alias' => $this->faker->word(),
            'banco' => $this->faker->company(),
            'tipo_cuenta' => $this->faker->randomElement(['Caja de ahorro', 'Cuenta corriente']),
            'predeterminado' => $this->faker->boolean(20),
        ];
    }
}
