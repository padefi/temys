<?php

namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto_categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class Producto_subcategoriaFactory extends Factory
{

    public function definition(): array
    {
         $categoria= Producto_categoria::inRandomOrder()->first() ?? Producto_categoria::factory()->create();
         $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'descripcion' =>$this->faker->text(),
            'categoria_id'=>$categoria->id,
            'fecha_creacion' =>$this->faker->date,
            'usuario_creacion' =>$user->id,
            'fecha_actualizacion' =>$this->faker->date,
            'usuario_actualizacion' =>$user->id,
        ];
    }
}
