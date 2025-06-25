<?php


namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto_modelo;
use App\Models\Inventario\Productos\Producto_subcategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventario\Productos\Producto>
 */
class ProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $modelo = Producto_modelo::inRandomOrder()->first() ?? Producto_modelo::factory()->create();
        $subcategoria = Producto_subcategoria::inRandomOrder()->first() ?? Producto_subcategoria::factory()->create();
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
