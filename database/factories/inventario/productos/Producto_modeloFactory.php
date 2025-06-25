<?php

namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto_marca;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class Producto_modeloFactory extends Factory
{
   
    public function definition(): array
    {
        $marca = Producto_marca::inRandomOrder()->first() ?? Producto_marca::factory()->create();
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
