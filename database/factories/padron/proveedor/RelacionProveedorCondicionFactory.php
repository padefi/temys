<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\CondicionIva;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionProveedorCondicionFactory extends Factory
{
    public function definition()
    {
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_iva' => CondicionIva::inRandomOrder()->first()->id ?? CondicionIva::factory()->create()->id,
            'id_proveedor' => Proveedor::inRandomOrder()->first()->id ?? Proveedor::factory()->create()->id,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
