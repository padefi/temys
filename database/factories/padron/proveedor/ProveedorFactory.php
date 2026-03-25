<?php

namespace Database\Factories\Padron\Proveedor;

use App\Models\Padron\Padron;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProveedorFactory extends Factory
{
    public function definition()
    {
        $tipoProveedor = ['Humana', 'Jurídica'];
        $usuarioId = User::inRandomOrder()->value('id');

        //Buscar padron con CUIT
        $padron = Padron::where('tipo_documento', 'CUIT')
            ->inRandomOrder()
            ->first();

        //Si no existe, lo creamos FORZANDO CUIT
        if (!$padron) {
            $padron = Padron::factory()->create([
                'tipo_documento' => 'CUIT',
            ]);
        }

        return [
            'id_padron' => $padron->id,
            'razon_social' => $this->faker->company,
            'nombre_fantasia' => $this->faker->company,
            'tipo' => $this->faker->randomElement($tipoProveedor),
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
        ];
    }
}
