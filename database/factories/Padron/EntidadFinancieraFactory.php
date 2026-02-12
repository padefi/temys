<?php

namespace Database\Factories\Padron;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ControlAcceso\User;
use App\Models\General\Nacionalidad;

class EntidadFinancieraFactory extends Factory
{
    public function definition(): array
    {
        $usuarioId      = User::inRandomOrder()->value('id');
        $nacionalidadId = Nacionalidad::inRandomOrder()->value('id');

        //60% Bancos, 40% CVU (Billetera / Financiera)
        $tipoBase = $this->faker->randomElement(['Banco', 'CVU']);

        if ($tipoBase === 'Banco') {
            $clave = str_pad(
                (string) $this->faker->unique()->numberBetween(1, 999),
                3,
                '0',
                STR_PAD_LEFT
            );

            $tipo = 'Banco';
        } else {
            $clave = $this->faker->unique()->numerify('########');

            //Dentro de CVU, repartimos tipos
            $tipo = $this->faker->randomElement([
                'Billetera Virtual',
                'Financiera',
            ]);
        }

        return [
            'descripcion'           => $this->faker->company,
            'tipo'                  => $tipo,
            'nacionalidad'          => $nacionalidadId,
            'clave_unica'           => $clave,
            'habilitado'            => true,
            'fecha_creacion'        => now(),
            'usuario_creacion'      => $usuarioId,
            'fecha_actualizacion'   => null,
            'usuario_actualizacion' => null,
        ];
    }
}