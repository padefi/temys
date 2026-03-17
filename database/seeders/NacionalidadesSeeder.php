<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NacionalidadesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nacionalidades')->insert([
            ['id_nac' => 'ARG', 'nacionalidad' => 'Argentina', 'orden' => 1],
            ['id_nac' => 'ALE', 'nacionalidad' => 'Alemania', 'orden' => 2],
            ['id_nac' => 'BOL', 'nacionalidad' => 'Bolivia', 'orden' => 3],
            ['id_nac' => 'BRA', 'nacionalidad' => 'Brasil', 'orden' => 4],
            ['id_nac' => 'CHI', 'nacionalidad' => 'Chile', 'orden' => 5],
            ['id_nac' => 'COL', 'nacionalidad' => 'Colombia', 'orden' => 6],
            ['id_nac' => 'CUB', 'nacionalidad' => 'Cuba', 'orden' => 7],
            ['id_nac' => 'ECU', 'nacionalidad' => 'Ecuador', 'orden' => 8],
            ['id_nac' => 'ESP', 'nacionalidad' => 'España', 'orden' => 9],
            ['id_nac' => 'HAI', 'nacionalidad' => 'Haití', 'orden' => 10],
            ['id_nac' => 'ITA', 'nacionalidad' => 'Italia', 'orden' => 11],
            ['id_nac' => 'OTR', 'nacionalidad' => 'Otra', 'orden' => 12],
            ['id_nac' => 'PAR', 'nacionalidad' => 'Paraguay', 'orden' => 13],
            ['id_nac' => 'PER', 'nacionalidad' => 'Peru', 'orden' => 14],
            ['id_nac' => 'POL', 'nacionalidad' => 'Polonia', 'orden' => 15],
            ['id_nac' => 'POR', 'nacionalidad' => 'Portugal', 'orden' => 16],
            ['id_nac' => 'RUS', 'nacionalidad' => 'Rusia', 'orden' => 17],
            ['id_nac' => 'URU', 'nacionalidad' => 'Uruguay', 'orden' => 18],
            ['id_nac' => 'VEN', 'nacionalidad' => 'Venezuela', 'orden' => 19],
        ]);
    }
}
