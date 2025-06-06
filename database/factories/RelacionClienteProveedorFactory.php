<?php

namespace Database\Factories;

use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionClienteProveedorFactory extends Factory
{
    public function definition()
    {
        return [
            'id_cliente' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory()->create()->id,
            'id_proveedor' => Proveedor::inRandomOrder()->first()->id ?? Proveedor::factory()->create()->id,
        ];
    }
}
