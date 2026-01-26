<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\Plan;
use App\Models\ControlAcceso\User as ControlAccesoUser;
use App\Models\General\TipoMoneda;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenTesoreriaFactory extends Factory
{
    public function definition(): array
    {

        return [

            'tipo' => $this->faker->randomElement(['Pago', 'Cobro']),
            'plan_id' => Plan::factory(),
            'moneda_id' => TipoMoneda::factory(),
            'metodo_id' => $this->faker->randomElement(['efectivo', 'transferencia', 'tarjeta']),
            'importe' => $this->faker->randomFloat(2, 1000, 500000),
            'fecha' => $this->faker->date(),

            'estado' => $this->faker->randomElement(['Pendiente', 'Confirmado']),
            'usuario_creacion' => ControlAccesoUser::factory(),
            'usuario_aprobacion' => null,
        ];
    }
}
