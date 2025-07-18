<?php

namespace Database\Seeders;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Seeder;

class InventarioRelacionUserAlmacenSeeder extends Seeder
{
    public function run(): void
    {
        // Obtiene los primeros 5 usuarios y todos los almacenes
        $usuarios = User::take(5)->get();
        $almacenes = Almacen::all();

        // Validación básica
        if ($usuarios->isEmpty() || $almacenes->isEmpty()) {
            $this->command->info('No hay usuarios o almacenes disponibles para asignar.');
            return;
        }

        // Relaciona los 5 usuarios con almacenes aleatorios
        foreach ($usuarios as $usuario) {
            $almacenesAleatorios = $almacenes->random(rand(1, min(3, $almacenes->count())));
            $usuario->almacenes()->syncWithoutDetaching($almacenesAleatorios->pluck('id'));
        }

        $this->command->info('Relaciones de 5 usuarios con almacenes creadas correctamente.');
    }
}
