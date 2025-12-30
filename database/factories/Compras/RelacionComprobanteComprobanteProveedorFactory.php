<?php

namespace Database\Factories\Compras;

use App\Models\Compras\RelacionComprobanteComprobanteProveedor;
use App\Models\Compras\ComprobanteProveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionComprobanteComprobanteProveedorFactory extends Factory
{
    protected $model = RelacionComprobanteComprobanteProveedor::class;

    public function definition(): array
    {
        return [
            'comprobante_origen_id' => ComprobanteProveedor::factory(),
            'comprobante_destino_id' => ComprobanteProveedor::factory(),
            'importe_aplicado' => $this->faker->randomFloat(2, 1000, 50000),
            'fecha_aplicacion' => $this->faker->date(),
        ];
    }
}
