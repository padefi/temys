<?php

namespace Database\Factories\Contabilidad\Asientos;

use App\Models\Contabilidad\Asientos\Partida;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartidaFactory extends Factory
{
    protected $model = Partida::class;

    public function definition(): array
    {
        $importe = $this->faker->randomFloat(2, 100, 50000);
        $esDebe = $this->faker->boolean(50);

        return [
            'co_asiento_id' => Asiento::inRandomOrder()->value('id')
                ?? Asiento::factory(),

            'co_cuenta_id' => Cuenta::inRandomOrder()->value('id')
                ?? Cuenta::factory(),

            'concepto' => $this->faker->sentence(3),

            'debe'  => $esDebe ? $importe : 0,
            'haber' => $esDebe ? 0 : $importe,
        ];
    }

    /* ===== States ===== */

    public function debe(float $importe = null): static
    {
        return $this->state(fn () => [
            'debe'  => $importe ?? $this->faker->randomFloat(2, 100, 50000),
            'haber' => 0,
        ]);
    }

    public function haber(float $importe = null): static
    {
        return $this->state(fn () => [
            'debe'  => 0,
            'haber' => $importe ?? $this->faker->randomFloat(2, 100, 50000),
        ]);
    }
}
