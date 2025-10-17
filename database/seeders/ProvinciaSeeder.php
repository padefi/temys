<?php

namespace Database\Seeders;

use App\Models\Patrimonio\Inmuebles\Provincia;
use Illuminate\Database\Seeder;


class ProvinciaSeeder extends Seeder
{
    public function run(): void
    {
        $provincias = [
            'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
            'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
            'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
            'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
        ];

        foreach ($provincias as $nombre) {
            Provincia::create(['nombre' => $nombre]);
        }
    }
}
