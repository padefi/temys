<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaPagoTransferencia;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\Padron\PadronCbu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaPagoTransferencia>
 */
class OrdenTesoreriaPagoTransferenciaFactory extends Factory
{
    protected $model = OrdenTesoreriaPagoTransferencia::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::where('tipo', 'pago')
                ->inRandomOrder()
                ->value('id') ?? OrdenTesoreria::factory(),

            'cuenta_bancaria_origen_id' => CuentaBancaria::query()
                ->inRandomOrder()
                ->value('id') ?? CuentaBancaria::factory(),

            'tipo' => $this->faker->randomElement(['cliente', 'proveedor']),

            'cbu_id' => PadronCbu::query()
                ->inRandomOrder()
                ->value('id') ?? PadronCbu::factory(),

            'numero_operacion' => $this->faker->optional()
                ->numerify('TR-########'),

            'usuario_creacion' => User::query()
                ->inRandomOrder()
                ->value('id') ?? User::factory(),
        ];
    }
}
