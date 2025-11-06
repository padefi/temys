<?php

namespace Database\Factories\Compras;

use App\Models\Compras\PlanPago;
use App\Models\ControlAcceso\User as ControlAccesoUser;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\Tarjeta;
use App\Models\General\TipoMoneda;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenPagoFactory extends Factory
{
    public function definition(): array
    {

        $banco_origen_id = Banco::inRandomOrder()->first()->id;
        $cuenta_origen_id = CuentaBancaria::inRandomOrder()->first()->id;
        $tarjeta_origen_id = Tarjeta::inRandomOrder()->first()->id;

        return [
            'plan_pago_id' => PlanPago::factory(),
            'moneda_id' => TipoMoneda::factory(),
            'metodo_pago' => $this->faker->randomElement(['efectivo', 'transferencia', 'tarjeta']),
            'importe' => $this->faker->randomFloat(2, 1000, 500000),
            'fecha_pago' => $this->faker->date(),
            'banco_origen_id' => $banco_origen_id,
            'cuenta_origen_id' => $cuenta_origen_id,
            'tarjeta_origen_id' => $tarjeta_origen_id,
            'cbu_pago' => $this->faker->numerify('########################'),
            'usuario_creacion' => ControlAccesoUser::factory(),
            'usuario_pago' => null,
        ];
    }
}
