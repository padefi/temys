<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Proveedor\ActividadEconomicaProveedor;
use App\Models\Padron\Proveedor\RelacionProveedorActividad;
use App\Models\ControlAcceso\User;

class RelacionProveedorActividadSeeder extends Seeder
{
    public function run(): void
    {
        $usuarioId = User::inRandomOrder()->value('id');

        $proveedores = Proveedor::all();
        $actividades = ActividadEconomicaProveedor::pluck('id');

        foreach ($proveedores as $proveedor) {
            //Cantidad aleatoria de actividades (1 a 3)
            $cantidad = rand(1, min(3, $actividades->count()));

            $actividadesAsignadas = $actividades
                ->random($cantidad)
                ->unique();

            foreach ($actividadesAsignadas as $actividadId) {
                RelacionProveedorActividad::updateOrCreate(
                    [
                        'id_proveedor' => $proveedor->id,
                        'id_actividad' => $actividadId,
                    ],
                    [
                        'fecha_creacion' => now(),
                        'usuario_creacion' => $usuarioId,
                    ]
                );
            }
        }
    }
}