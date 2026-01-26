<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroEfectivo;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaCobroEfectivo>
 */
class OrdenTesoreriaCobroEfectivoFactory extends Factory
{
    protected $model = OrdenTesoreriaCobroEfectivo::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::query()->inRandomOrder()->value('id')
                ?? OrdenTesoreria::factory(),

            // En efectivo puede no existir, pero dejamos uno identificable
            'numero_operacion' => $this->faker->optional()->numerify('EFE-########'),

            'usuario_creacion' => User::query()->inRandomOrder()->value('id')
                ?? User::factory(),
        ];
    }
}
