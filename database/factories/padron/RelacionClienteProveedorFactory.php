<?php

namespace Database\Factories\Padron;

use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionClienteProveedorFactory extends Factory
{
    public function definition()
    {
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_cliente' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory()->create()->id,
            'id_proveedor' => Proveedor::inRandomOrder()->first()->id ?? Proveedor::factory()->create()->id,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
