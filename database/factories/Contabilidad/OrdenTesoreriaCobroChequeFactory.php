<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\OrdenTesoreriaCobroCheque;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdenTesoreriaCobroCheque>
 */
class OrdenTesoreriaCobroChequeFactory extends Factory
{
    protected $model = OrdenTesoreriaCobroCheque::class;

    public function definition(): array
    {
        return [
            'orden_tesoreria_id' => OrdenTesoreria::query()->inRandomOrder()->value('id')
                ?? OrdenTesoreria::factory(),

            'banco_emisor_id'    => rand(1, 10),
            'banco_destino_id'   => rand(1, 10),
            'cuenta_destino_id'  => rand(1, 10),
            'fecha_cheque'       => now(),
            'numero_cheque'      => 'CHQ-' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),


            // Número de cheque
            'numero_operacion' => $this->faker->optional()
                ->numerify('CHQ-########'),

            'usuario_creacion' => User::query()->inRandomOrder()->value('id')
                ?? User::factory(),
        ];
    }
}
