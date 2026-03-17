<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;
use App\Models\Padron\Proveedor\RelacionProveedorActividad;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionProveedorActividadFactory extends Factory
{
    protected $model = RelacionProveedorActividad::class;

    public function definition()
    {
        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'id_actividad' => ActividadEconomicaProveedor::inRandomOrder()->value('id') ?? ActividadEconomicaProveedor::factory()->create()->id,
            'id_proveedor' => Proveedor::inRandomOrder()->value('id') ?? Proveedor::factory()->create()->id,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
