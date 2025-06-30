<?php

namespace Database\Factories\Compras;

use App\Models\Compras\OrdenCompraDetalle;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCompraDetalleFactory extends Factory
{
    protected $model = OrdenCompraDetalle::class;

    public function definition()
    {
           $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'producto_id' => Producto::inRandomOrder()->value('id') ?? 1,
            'cantidad_solicitada' => $this->faker->numberBetween(1, 100),
            'precio' => $this->faker->randomFloat(2, 10, 500),
            'fecha_creacion' => now(),
            'usuario_creacion' =>$user->id,
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $user->id,
        ];
    }
}
