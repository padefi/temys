<?php

namespace Database\Factories\Compras;

use App\Models\Compras\ComprobanteProveedorDetalleImpuesto;
use App\Models\Compras\ComprobanteProveedorDetalle;
use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComprobanteProveedorDetalleImpuestoFactory extends Factory
{
    protected $model = ComprobanteProveedorDetalleImpuesto::class;

    public function definition(): array
    {
        $detalle = ComprobanteProveedorDetalle::inRandomOrder()->first();
        $impuesto = Impuesto::inRandomOrder()->first();

        return [
            'detalle_id' => $detalle->id,
            'impuesto_id' => $impuesto->id,
        ];
    }
}
