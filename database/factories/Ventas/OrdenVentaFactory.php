<?php

namespace Database\Factories\Ventas;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\General\TipoMoneda;
use App\Models\Ventas\ordenVenta;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ordenVenta>
 */
class OrdenVentaFactory extends Factory
{
   protected $model = ordenVenta::class;

    public function definition()
    {
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'cliente_id' => Cliente::inRandomOrder()->value('id') ?? Cliente::factory(),
            'moneda_id' => TipoMoneda::inRandomOrder()->value('id') ?? TipoMoneda::factory(),
            'almacen_destino_id' => Almacen::inRandomOrder()->value('id') ?? 1,
            'entrega_esperada' => $this->faker->dateTimeBetween('now', '+10 days'),
            'observaciones' => $this->faker->sentence(8),
            'estado' => $this->faker->randomElement(['Pendiente', 'Confirmada','Finalizada', 'Cancelada']),
            'fecha_creacion' => now(),
            'usuario_creacion' => $user->id,
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $user->id,
        ];
    }
}
