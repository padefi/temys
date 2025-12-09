<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\TipoMoneda;

class TipoMonedaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $monedas = [
            [
                'codigo' => 'ARS',
                'descripcion' => 'Peso argentino',
                'simbolo' => '$',
                'pais_origen' => 'Argentina',
            ],
            [
                'codigo' => 'USD',
                'descripcion' => 'Dólar estadounidense',
                'simbolo' => '$',
                'pais_origen' => 'Estados Unidos',
            ],
            [
                'codigo' => 'EUR',
                'descripcion' => 'Euro',
                'simbolo' => '€',
                'pais_origen' => 'Unión Europea',
            ],
            [
                'codigo' => 'BRL',
                'descripcion' => 'Real brasileño',
                'simbolo' => 'R$',
                'pais_origen' => 'Brasil',
            ],
            [
                'codigo' => 'CLP',
                'descripcion' => 'Peso chileno',
                'simbolo' => '$',
                'pais_origen' => 'Chile',
            ],
            [
                'codigo' => 'UYU',
                'descripcion' => 'Peso uruguayo',
                'simbolo' => '$',
                'pais_origen' => 'Uruguay',
            ],
            [
                'codigo' => 'MXN',
                'descripcion' => 'Peso mexicano',
                'simbolo' => '$',
                'pais_origen' => 'México',
            ],
            [
                'codigo' => 'GBP',
                'descripcion' => 'Libra esterlina',
                'simbolo' => '£',
                'pais_origen' => 'Reino Unido',
            ],
            [
                'codigo' => 'JPY',
                'descripcion' => 'Yen japonés',
                'simbolo' => '¥',
                'pais_origen' => 'Japón',
            ],
            [
                'codigo' => 'CNY',
                'descripcion' => 'Yuan chino',
                'simbolo' => '¥',
                'pais_origen' => 'China',
            ],
        ];

        foreach ($monedas as $moneda) {
            TipoMoneda::firstOrCreate(
                ['codigo' => $moneda['codigo']],
                $moneda
            );
        }
    }
}
