<?php

namespace Database\Factories\Padron\Cliente;

use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\CondicionIva;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionClienteCondicionFactory extends Factory
{
    public function definition()
    {
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_iva' => CondicionIva::inRandomOrder()->first()->id ?? CondicionIva::factory()->create()->id,
            'id_cliente' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory()->create()->id,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
