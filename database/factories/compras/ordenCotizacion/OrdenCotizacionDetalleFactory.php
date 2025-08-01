<?php

namespace Database\Factories\Compras\OrdenCotizacion;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCotizacionDetalleFactory extends Factory
{
    public function definition(): array
    {
        $cantidad = $this->faker->numberBetween(1, 100);
        $precioUnitario = $this->faker->randomFloat(2, 10, 1000);
        $descuento = $this->faker->randomFloat(2, 0, 20);
        $importe = $cantidad * $precioUnitario * (1 - $descuento / 100);

        $producto = Producto::inRandomOrder()->first() ?? Producto::factory()->create();

        return [
            'orden_cotizaciones_id' => OrdenCotizacion::inRandomOrder()->value('id') ?? OrdenCotizacion::factory(),
            'producto_id' => $producto->id,
            'descripcion' => $producto->descripcion ?? $this->faker->sentence(4),
            'codigo_barras' => $producto->cod_barras ?? $this->faker->ean13,
            'referencia' => $producto->referencia ?? $this->faker->word,
            'cantidad' => $cantidad,
            'precio_unitario' => $precioUnitario,
            'porcentaje_descuento' => $descuento,
            'importe' => $importe,
            'usuario_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'usuario_actualizacion' => User::inRandomOrder()->value('id') ?? User::factory(),
        ];
    }
}
