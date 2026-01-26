<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroTransferencia;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaCobroTransferencia>
 */
class OrdenTesoreriaCobroTransferenciaFactory extends Factory
{
    protected $model = OrdenTesoreriaCobroTransferencia::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::query()->inRandomOrder()->value('id')
                ?? OrdenTesoreria::factory(),

            'numero_operacion' => $this->faker->optional()->numerify('TRX-########'),

            'usuario_creacion' => User::query()->inRandomOrder()->value('id')
                ?? User::factory(),
        ];
    }
}
