<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\TipoContacto;
use App\Models\ControlAcceso\User;

class TipoContactoPadronSeeder extends Seeder
{
    public function run(): void
    {
        $usuarioId = User::inRandomOrder()->value('id');

        $contactos = [
            ['descripcion' => 'Teléfono'],
            ['descripcion' => 'Celular'],
            ['descripcion' => 'Email'],
        ];

        foreach ($contactos as $item) {
            TipoContacto::create([
                'descripcion' => $item['descripcion'],
                'habilitado' => true,
                'fecha_creacion' => now(),
                'usuario_creacion' => $usuarioId,
                'fecha_actualizacion' => null,
                'usuario_actualizacion' => null,
            ]);
        }
    }
}
