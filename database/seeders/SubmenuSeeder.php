<?php

namespace Database\Seeders;

use App\Models\AccessControl\Submenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubmenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $submenus = [
            //AFILIADOS
            'Data entry',
            'Consulta de afiliados',

            //BENEFICIOS
            'Natalidad',
            'Luna de miel',
            'Casamiento',

            //ORDENES
            'Cotizaciones',
            'Ordenes',
            'Equipos de ventas',

            //POR FACTURAR
            'Ordenes a facturar',
            'Ordenes para crear ventas adicionales',

            //CLIENTES
            'Consulta de clientes',
            'Notas de debito',
            'Notas de credito',

            //PROVEEDORES
            'Consulta de proveedores',
            'Notas de debito',
            'Notas de credito',

            //CONTABILIDAD
            'Consulta de cuentas',
            'Consulta de asientos',
            'Consulta de asientos por cuenta',
        ];

        foreach ($submenus as $submenu)
        {
            Submenu::create(['name' => $submenu]);
        }
    }
}
