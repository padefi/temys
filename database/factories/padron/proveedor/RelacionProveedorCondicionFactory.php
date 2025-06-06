<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\CondicionIva;
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
