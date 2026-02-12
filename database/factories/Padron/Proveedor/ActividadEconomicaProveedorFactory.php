<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\ControlAcceso\User;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActividadEconomicaProveedorFactory extends Factory
{
    protected $model = ActividadEconomicaProveedor::class;

    public function definition()
    {
        $actividades = [
            'Intereses',
            'Alquileres',
            'Bienes Inmuebles Urbanos',
            'Enajenación de Bienes Muebles',
            'Locación de Obras y Servicios',
            'Comisiones',
            'Prof. Liberales',
            'Otra Cesión o Locación',
            'Transferencia de Derechos, LLaves, Marcas y Patentes',
            'No Aplica',
        ];

        $usuarioId = User::inRandomOrder()->value('id');

        return [
            'descripcion' => $this->faker->randomElement($actividades),
            'habilitado' => true,
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
            'fecha_actualizacion' => null,
            'usuario_actualizacion' => null,
        ];
    }
}
