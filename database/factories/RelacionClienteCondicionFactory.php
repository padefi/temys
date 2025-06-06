<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\CondicionIva;
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
