<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaPagoTarjeta;
use App\Models\ControlAcceso\User;
use App\Models\General\Tarjeta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaPagoTarjeta>
 */
class OrdenTesoreriaPagoTarjetaFactory extends Factory
{
    protected $model = OrdenTesoreriaPagoTarjeta::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::where('tipo', 'pago')
                ->inRandomOrder()
                ->value('id') ?? OrdenTesoreria::factory(),

            'tarjeta_origen_id' => Tarjeta::query()
                ->inRandomOrder()
                ->value('id') ?? Tarjeta::factory(),

            'numero_operacion' => $this->faker->optional()
                ->numerify('TARJ-########'),

            'usuario_creacion' => User::query()
                ->inRandomOrder()
                ->value('id') ?? User::factory(),
        ];
    }
}
