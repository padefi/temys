<?php

namespace Database\Seeders;

use App\Models\AccessControl\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            //AFILIADOS
            'Afiliados',
            'Beneficios',
            'Fondo de sepelio',
            'P.A.S.',
            'Turismo',

            //VENTAS
            'Ordenes',
            'Por facutrar',
            'Productos',
            'Reportes',
            'Configuracion',

            //CONTABILIDAD
            'Tablero',
            'Clientes',
            'Proveedores',
            'Contabilidad',
            'Reportes',
            'Configuracion',
        ];

        foreach ($menus as $menu)
        {
            Menu::create(['name' => $menu]);
        }
    }
}
