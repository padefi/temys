<?php

namespace Database\Factories\Padron\Clientes;

use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\CondicionIva;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionClienteCondicionFactory extends Factory
{
    public function definition()
    {
        return [
            'id_iva' => CondicionIva::inRandomOrder()->first()->id ?? CondicionIva::factory()->create()->id,
            'id_cliente' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory()->create()->id,
        ];
    }
}
