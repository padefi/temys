<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\RelacionComprobanteComprobante;
use App\Models\Contabilidad\Comprobante;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionComprobanteComprobanteFactory extends Factory
{
    protected $model = RelacionComprobanteComprobante::class;

    public function definition(): array
    {
        return [
            'comprobante_origen_id' => Comprobante::factory(),
            'comprobante_destino_id' => Comprobante::factory(),
            'importe_aplicado' => $this->faker->randomFloat(2, 1000, 50000),
            'fecha_aplicacion' => $this->faker->date(),
        ];
    }
}
