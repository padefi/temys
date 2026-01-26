<?php

namespace Database\Factories\Ventas;

use App\Models\ControlAcceso\User;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\Tarjeta;
use App\Models\General\TipoMoneda;
use App\Models\Contabilidad\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenCobro>
 */
class OrdenCobroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $banco_origen_id = Banco::inRandomOrder()->first()->id;
        $cuenta_origen_id = CuentaBancaria::inRandomOrder()->first()->id;
        $tarjeta_origen_id = Tarjeta::inRandomOrder()->first()->id;

        return [
            'plan_pago_id' => Plan::factory(),
            'moneda_id' => TipoMoneda::factory(),
            'metodo_cobro' => $this->faker->randomElement(['efectivo', 'transferencia', 'tarjeta']),
            'importe' => $this->faker->randomFloat(2, 1000, 500000),
            'fecha_cobro' => $this->faker->date(),
            'banco_origen_id' => $banco_origen_id,
            'cuenta_origen_id' => $cuenta_origen_id,
            'tarjeta_origen_id' => $tarjeta_origen_id,
            'cbu_cobro' => $this->faker->numerify('########################'),
            'usuario_creacion' => User::factory(),
            'usuario_cobro' => null,
        ];
    }
}
