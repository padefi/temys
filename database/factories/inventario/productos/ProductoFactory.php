<?php


namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;

use App\Models\Inventario\Productos\ProductoModelo;
use App\Models\Inventario\Productos\ProductoSubcategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    public function definition(): array
    {
        $modelo = ProductoModelo::inRandomOrder()->first() ?? ProductoModelo::factory()->create();
        $subcategoria = ProductoSubcategoria::inRandomOrder()->first() ?? ProductoSubcategoria::factory()->create();
        $user = User::inRandomOrder()->first() ?? User::factory()->create();

        return [
            'nombre' => $this->generarNombreProducto(),
            'descripcion' => $this->faker->sentence(),
            'modelo_id' => $modelo->id,
            'subcategoria_id' => $subcategoria->id,
            'peso' => $this->faker->randomFloat(2, 0.1, 10),
            'alto' => $this->faker->randomFloat(2, 1, 100),
            'ancho' => $this->faker->randomFloat(2, 1, 100),
            'volumen' => $this->faker->randomFloat(2, 1, 200),
            'profundidad' => $this->faker->randomFloat(2, 1, 100),
            'cod_barras' => $this->faker->unique()->ean13(),
            'es_inventario' => $this->faker->boolean(),
            'es_patrimonio' => $this->faker->boolean(),
            'referencia' => $this->faker->text(20),
            'fecha_creacion' => $this->faker->date,
            'usuario_creacion' => $user->id,
            'fecha_actualizacion' => $this->faker->date,
            'usuario_actualizacion' => $user->id,
        ];
    }

    private function generarNombreProducto(): string
    {
        $tipos = ['Laptop', 'Tablet', 'Celular', 'Teclado', 'Mouse', 'Monitor', 'Cámara', 'Impresora'];
        $adjetivos = ['Pro', 'Max', 'Lite', 'Plus', 'Smart', 'Ultra', 'Eco', 'X'];
        $modelo = $this->faker->bothify('###');

        return $this->faker->randomElement($tipos) . ' ' .
               $this->faker->randomElement($adjetivos) . ' ' .
               $modelo;
    }
}

