<?php

namespace Database\Factories\Almacenes;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\TipoAlmacen;
use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\Padron\Cliente\Cliente;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AlmacenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $AlmacenTipo = TipoAlmacen::cases();
        $randomAlmacen = $AlmacenTipo[array_rand($AlmacenTipo)];

        $responsable = Cliente::inRandomOrder()->first() ?? Cliente::factory()->create();
        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        //$almacenPadre = Almacen::inRandomOrder()->first();
        return [
            'nombre' => $this->generarNombreAlmacen(),
            'tipo' => $randomAlmacen->value,
            'responsable_id' => $responsable->id,
            'almacen_padre_id' =>1,
            'fecha_creacion' => $this->faker->date,
            'usuario_creacion' => $user->id,
            'fecha_actualizacion' => $this->faker->date,
            'usuario_actualizacion' => $user->id,
        ];
    }

        private function generarNombreAlmacen(): string
    {
        $tipos = ['Secretaria central', 'Tapiales', 'Remedios de escalada', 'Retiro', 'Constitucion', 'Retiro', 'Mar del plata', 'Cordoba'];
       

        return $this->faker->randomElement($tipos);
              
    }
}
