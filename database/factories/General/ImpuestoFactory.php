<?php

namespace Database\Factories\General;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
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
            'co_cuenta_id' => Cuenta::query()->inRandomOrder()->value('id')
            ?? Cuenta::factory()->create()->id,
            'habilitado' => $this->faker->boolean(90),
        ];
    }
}
