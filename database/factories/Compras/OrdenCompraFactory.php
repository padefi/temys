<?php

namespace Database\Factories\Compras;

use App\Models\Compras\OrdenCompra;
use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenCompraFactory extends Factory
{
    protected $model = OrdenCompra::class;

    public function definition()
    {
         $user= User::inRandomOrder()->first() ?? User::factory()->create();
         $proovedor= Proveedor::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'proveedor_id' => $proovedor->id, // Debes tener proveedores creados
            'almacen_destino_id' => Almacen::inRandomOrder()->value('id') ?? 1,
            'estado' => $this->faker->randomElement(['Enviada', 'Cerrada', 'Cancelada']),
            'fecha_creacion' => now(),
            'usuario_creacion' => $user->id,
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $user->id,
        ];
    }
}
