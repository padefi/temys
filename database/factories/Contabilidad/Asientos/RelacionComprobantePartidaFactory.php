<?php

namespace Database\Factories\Contabilidad\Asientos;

use App\Models\Compras\ComprobanteProveedor;
use App\Models\Contabilidad\Asientos\Partida;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionComprobantePartidaFactory extends Factory
{
    public function definition()
    {
        return [
            'comprobante_id' => ComprobanteProveedor::inRandomOrder()->value('id')
                                ?? ComprobanteProveedor::factory()->create()->id,

            'partida_id' => Partida::inRandomOrder()->value('id')
                            ?? Partida::create([
                                'co_asiento_id' => 1,
                                'co_cuenta_id'  => 1,
                                'concepto'      => 'Auto generado',
                                'debe'          => 0,
                                'haber'         => 0,
                            ])->id,

            'importe_aplicado' => $this->faker->randomFloat(2, 100, 10000),
            'fecha_aplicacion' => $this->faker->date(),
        ];
    }
}
