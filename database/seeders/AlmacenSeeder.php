<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Almacenes\Almacen;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AlmacenSeeder extends Seeder
{
    public function run(): void
    {
    

        $now = Carbon::now();

        // Insertar algunos almacenes padre
        $almacenPadre1 = Almacen::create([
            'nombre' => 'Almacén Central',
            'tipo' => 'Principal',
            'responsable_id' => 1, // Ajusta el ID según usuario existente
            'almacen_padre_id' => null,
            'fecha_creacion' => $now,
            'usuario_creacion' => 'admin',
            'fecha_actualizacion' => $now,
            'usuario_actualizacion' => 'admin',
        ]);

        $almacenPadre2 = Almacen::create([
            'nombre' => 'Almacén Secundario',
            'tipo' => 'Secundario',
            'responsable_id' => 2,
            'almacen_padre_id' => null,
            'fecha_creacion' => $now,
            'usuario_creacion' => 'admin',
            'fecha_actualizacion' => $now,
            'usuario_actualizacion' => 'admin',
        ]);

        // Insertar almacenes hijos
        Almacen::create([
            'nombre' => 'Almacén Zona Norte',
            'tipo' => 'Sucursal',
            'responsable_id' => 3,
            'almacen_padre_id' => $almacenPadre1->id,
            'fecha_creacion' => $now,
            'usuario_creacion' => 'admin',
            'fecha_actualizacion' => $now,
            'usuario_actualizacion' => 'admin',
        ]);

        Almacen::create([
            'nombre' => 'Almacén Zona Sur',
            'tipo' => 'Sucursal',
            'responsable_id' => 4,
            'almacen_padre_id' => $almacenPadre2->id,
            'fecha_creacion' => $now,
            'usuario_creacion' => 'admin',
            'fecha_actualizacion' => $now,
            'usuario_actualizacion' => 'admin',
        ]);
    }
}
