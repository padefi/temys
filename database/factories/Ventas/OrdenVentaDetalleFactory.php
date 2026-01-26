<?php

namespace Database\Factories;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use App\Models\Ventas\ordenVenta;
use App\Models\Ventas\OrdenVentaDetalle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ordenVentaDetalle>
 */
class OrdenVentaDetalleFactory extends Factory
{
    protected $model = ordenVentaDetalle::class;

    public function definition()
    {
            $cantidad = $this->faker->numberBetween(1, 100);
            $precioUnitario = $this->faker->randomFloat(2, 10, 1000);
            $descuento = $this->faker->randomFloat(2, 0, 20);
            $importe = $cantidad * $precioUnitario * (1 - $descuento / 100);
            $user= User::inRandomOrder()->first() ?? User::factory()->create();

            $producto = Producto::inRandomOrder()->first() ?? Producto::factory()->create();

        return [
            'orden_ventas_id' => ordenVenta::inRandomOrder()->value('id') ?? ordenVenta::factory(),
            'producto_id' => $producto->id,
            'entrega_esperada' => $this->faker->dateTimeBetween('now', '+10 days'),
            'descripcion' => $producto->descripcion ?? $this->faker->sentence(4),
            'cantidad' => $cantidad,
            'precio_unitario' => $precioUnitario,
            'porcentaje_descuento' => $descuento,
            'importe' => $importe,
            'usuario_creacion' => User::inRandomOrder()->value('id') ?? User::factory(),
            'usuario_actualizacion' => User::inRandomOrder()->value('id') ?? User::factory(),
        ];
    }
}
