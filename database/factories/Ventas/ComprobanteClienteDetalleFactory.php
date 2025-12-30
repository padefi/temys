<?php

namespace Database\Factories\Ventas;

use App\Models\Ventas\ComprobanteClienteDetalle;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use App\Models\Ventas\ComprobanteCliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ComprobanteClienteDetalle>
 */
class ComprobanteClienteDetalleFactory extends Factory
{
    protected $model = ComprobanteClienteDetalle::class;

    public function definition(): array
    {
        $usuario = User::inRandomOrder()->first();
        $comprobante = ComprobanteCliente::inRandomOrder()->first();

        $cantidad = $this->faker->numberBetween(1, 10);
        $precio = $this->faker->randomFloat(2, 50, 1000);
        $descuento = $this->faker->numberBetween(0, 20);

        $producto = Producto::query()->inRandomOrder()->first();

        return [
            'comprobante_cliente_id' => $comprobante->id,
            'producto_id' => $producto->id,
            'descripcion' => $this->faker->word(),
            'modelo' => strtoupper($this->faker->lexify('MOD???')),
            'unidad_medida' => 'Unidad',
            'cantidad' => $cantidad,
            'precio_unitario' => $precio,
            'porcentaje_descuento' => $descuento,
            'co_cuenta' => $this->faker->numerify('4###'),
            'importe' => $cantidad * $precio * (1 - $descuento/100),
            'usuario_creacion' => $usuario->id,
            'usuario_actualizacion' => $usuario->id,
        ];
    }
}
