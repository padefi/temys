<?php

namespace Database\Factories\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventarioMovimientoStock>
 */
class InventarioMovimientoStockFactory extends Factory
{
    protected $model = InventarioMovimientoStock::class;

    public function definition(): array
    {
        $origen = Almacen::inRandomOrder()->first();
        $destino = Almacen::inRandomOrder()->where('id', '!=', $origen?->id)->first();

        return [
            'producto_id' => Producto::inRandomOrder()->value('id') ?? 1,
            'origen_id' => $origen?->id ?? 1,
            'destino_id' => $destino?->id ?? 2,
            'cantidad' => $this->faker->numberBetween(1, 100),
            'fecha_creacion' => now(),
            'usuario_creacion' => rand(1, 20),
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => rand(1, 20),
        ];
    }
}