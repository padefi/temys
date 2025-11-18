<?php

namespace Database\Factories\Compras;

use App\Models\Compras\OrdenCompra;
use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCompraFactory extends Factory
{
    protected $model = OrdenCompra::class;

    public function definition()
    {
        $user= User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'proveedor_id' => Proveedor::inRandomOrder()->value('id') ?? Proveedor::factory(),
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
