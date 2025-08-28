<?php

namespace Database\Seeders;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\Branch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class AlmacenSeeder extends Seeder
{
       public function run(): void
    {
        // Traemos los branches ya creados
        $branches = Branch::all();

        foreach ($branches as $branch) {
            Almacen::create([
                'nombre' => $branch->name,       // usamos el mismo nombre
                'tipo' => 'central',           // puedes ajustarlo según tu lógica
                'responsable_id' => 1,        // asigna un usuario si hace falta
                'almacen_padre_id' => 1,      // si quieres jerarquía
                'fecha_creacion' => now(),
                'usuario_creacion' =>1,         // usuario que lo creó (puedes poner Auth::id() si lo necesitas dinámico)
                'fecha_actualizacion' => now(),
                'usuario_actualizacion' => 1,
                // si tu tabla tiene branch_id, agrega:
                // 'branch_id' => $branch->id,
            ]);
        }
    }
}
