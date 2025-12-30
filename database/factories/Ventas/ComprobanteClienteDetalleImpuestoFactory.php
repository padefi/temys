<?php

namespace Database\Factories\Ventas;

use App\Models\General\Impuesto;
use App\Models\Ventas\ComprobanteClienteDetalleImpuesto;
use App\Models\Ventas\ComprobanteClienteDetalle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ComprobanteClienteDetalleImpuesto>
 */
class ComprobanteClienteDetalleImpuestoFactory extends Factory
{
    protected $model = ComprobanteClienteDetalleImpuesto::class;

    public function definition(): array
    {
        $detalle = ComprobanteClienteDetalle::inRandomOrder()->first();
        $impuesto = Impuesto::inRandomOrder()->first();

        return [
            'detalle_id' => $detalle->id,
            'impuesto_id' => $impuesto->id,
        ];
    }
}
