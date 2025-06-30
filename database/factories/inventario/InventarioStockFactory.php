<?php

namespace Database\Factories\inventario;;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\InventarioStock;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventarioStock>
 */
class InventarioStockFactory extends Factory
{
    protected $model = InventarioStock::class;

    public function definition(): array
    {
        return [
            'producto_id' => Producto::inRandomOrder()->value('id') ?? 1,
            'almacen_id' => Almacen::inRandomOrder()->value('id') ?? 1,
            'cantidad_actual' => $this->faker->numberBetween(10, 500),
            'stock_minimo' => $this->faker->numberBetween(5, 50),
            'fecha_creacion' => now(),
            'usuario_creacion' => rand(1, 20),
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => rand(1, 20),
        ];
    }
}
