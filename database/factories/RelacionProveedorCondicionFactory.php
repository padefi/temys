<?php

namespace Database\Factories;

use App\Models\Proveedor;
use App\Models\CondicionIva;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionProveedorCondicionFactory extends Factory
{
    public function definition()
    {
        return [
            'id_iva' => CondicionIva::inRandomOrder()->first()->id ?? CondicionIva::factory()->create()->id,
            'id_proveedor' => Proveedor::inRandomOrder()->first()->id ?? Proveedor::factory()->create()->id,
        ];
    }
}
