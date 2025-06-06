<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\Proveedor;
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
