<?php


namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;

use App\Models\Inventario\Productos\ProductoModelo;
use App\Models\Inventario\Productos\ProductoSubcategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $modelo = ProductoModelo::inRandomOrder()->first() ?? ProductoModelo::factory()->create();
        $subcategoria = ProductoSubcategoria::inRandomOrder()->first() ?? ProductoSubcategoria::factory()->create();
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'nombre' => $this->faker->name,
            'descripcion' => $this->faker->word(),
            'modelo_id' => $modelo->id,
            'subcategoria_id' => $subcategoria->id,
            'peso' => $this->faker->randomFloat(2, -90, 90),
            'alto' => $this->faker->randomFloat(2, -90, 90),
            'ancho' => $this->faker->randomFloat(2, -90, 90),
            'volumen' => $this->faker->randomFloat(2, -90, 90),
            'profundidad' => $this->faker->randomFloat(2, -90, 90),
            'cod_barras' => $this->faker->bothify('??###??'),
            'es_inventario' => $this->faker->boolean(),
            'es_patrimonio' => $this->faker->boolean(),
            'referencia' => $this->faker->text(),
            'fecha_creacion' =>$this->faker->date,
            'usuario_creacion' =>$user->id,
            'fecha_actualizacion' =>$this->faker->date,
            'usuario_actualizacion' =>$user->id,
        ];
    }
}
