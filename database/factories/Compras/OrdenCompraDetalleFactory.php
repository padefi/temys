<?php

namespace Database\Factories\Compras;

use App\Models\Compras\OrdenCompra;
use App\Models\Compras\OrdenCompraDetalle;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCompraDetalleFactory extends Factory
{
    protected $model = OrdenCompraDetalle::class;

    public function definition()
    {
            $cantidad = $this->faker->numberBetween(1, 100);
            $precioUnitario = $this->faker->randomFloat(2, 10, 1000);
            $descuento = $this->faker->randomFloat(2, 0, 20);
            $importe = $cantidad * $precioUnitario * (1 - $descuento / 100);
            $user= User::inRandomOrder()->first() ?? User::factory()->create();

            $producto = Producto::inRandomOrder()->first() ?? Producto::factory()->create();

        return [
            'orden_compras_id' => OrdenCompra::inRandomOrder()->value('id') ?? OrdenCompra::factory(),
            'orden_cotizaciones_id' => OrdenCotizacion::inRandomOrder()->value('id') ?? OrdenCotizacion::factory(),
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
