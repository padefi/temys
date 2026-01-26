<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\Contabilidad\OrdenTesoreriaPagoEfectivo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaPagoEfectivo>
 */
class OrdenTesoreriaPagoEfectivoFactory extends Factory
{
    protected $model = OrdenTesoreriaPagoEfectivo::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::where('tipo', 'pago')
                ->inRandomOrder()
                ->value('id') ?? OrdenTesoreria::factory(),

            'numero_operacion' => $this->faker->optional()
                ->numerify('EF-########'),

            'usuario_creacion' => User::query()
                ->inRandomOrder()
                ->value('id') ?? User::factory(),
        ];
    }
}
