<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\ComprobanteDetalleImpuesto;
use App\Models\Contabilidad\ComprobanteDetalle;
use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComprobanteDetalleImpuestoFactory extends Factory
{
    protected $model = ComprobanteDetalleImpuesto::class;

    public function definition(): array
    {
        $detalle = ComprobanteDetalle::inRandomOrder()->first();
        $impuesto = Impuesto::inRandomOrder()->first();

        return [
            'detalle_id' => $detalle->id,
            'impuesto_id' => $impuesto->id,
        ];
    }
}
