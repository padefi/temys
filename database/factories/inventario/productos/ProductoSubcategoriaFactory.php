<?php

namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\ProductoCategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductoSubcategoriaFactory extends Factory
{

    public function definition(): array
    {
         $categoria= ProductoCategoria::inRandomOrder()->first() ?? ProductoCategoria::factory()->create();
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
