<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\User as ControlAccesoUser;
use App\Models\Patrimonio\Inmuebles\Inmueble;
use App\Models\Patrimonio\Inmuebles\InmuebleTipo;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoEstado;
use App\Models\Patrimonio\Inmuebles\InmuebleTipoOcupacions;
use Illuminate\Database\Seeder;

use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class InmueblesSeeder extends Seeder
{
    public function run(): void
    {
        // Asegúrate de tener al menos un usuario
        $user = ControlAccesoUser::first() ?? ControlAccesoUser::factory()->create();

        for ($i = 1; $i <= 10; $i++) {
            Inmueble::create([
                'num_partida' => (string) rand(100000000, 999999999),  // número aleatorio
                'estado_id' => InmuebleTipoEstado::inRandomOrder()->first()->id,
                'nombre_completo' => 'Edificio ' . Str::random(5) . " #$i",
                'nombre_fantasia' => 'Torre ' . Str::random(3),
                'tipo_inmueble_id' => InmuebleTipo::inRandomOrder()->first()->id,
                'tipo_ocupacion_id' => InmuebleTipoOcupacions::inRandomOrder()->first()->id,
                'superficie_cubierta' => rand(100, 300) + rand(0, 99)/100, // número decimal aleatorio
                'superficie_libre' => rand(20, 100) + rand(0, 99)/100,
                'superficie_total' => rand(150, 400) + rand(0, 99)/100,
                'fecha_creacion' => Carbon::now(),
                'usuario_creacion' => $user->id,
                'fecha_actualizacion' => Carbon::now(),
                'usuario_actualizacion' => $user->id,
            ]);
        }
    }
}
