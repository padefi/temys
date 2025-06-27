<?php

namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\ProductoMarca;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductoModeloFactory extends Factory
{
   
    public function definition(): array
    {
        $marca = ProductoMarca::inRandomOrder()->first() ?? ProductoMarca::factory()->create();
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'descripcion' =>$this->faker->text(),
            'marca_id' =>$marca->id,
            'fecha_creacion' =>$this->faker->date,
            'usuario_creacion' =>$user->id,
            'fecha_actualizacion' =>$this->faker->date,
            'usuario_actualizacion' =>$user->id,
        ];
    }
}
