<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\Cheque;
use App\Models\Contabilidad\OrdenTesoreriaPagoCheque;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaPagoCheque>
 */
class OrdenTesoreriaPagoChequeFactory extends Factory
{
     protected $model = OrdenTesoreriaPagoCheque::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::query()->inRandomOrder()->value('id')
                ?? OrdenTesoreria::factory(),

            'cheque_id' => Cheque::query()->inRandomOrder()->value('id')
                ?? Cheque::factory(),

            'numero_cheque' => $this->faker->numerify('########'),

            'fecha_cheque' => $this->faker->date(),

            'numero_operacion' => $this->faker->optional()
                ->numerify('OP-########'),

            'usuario_creacion' => User::query()->inRandomOrder()->value('id')
                ?? User::factory(),
        ];
    }
}
