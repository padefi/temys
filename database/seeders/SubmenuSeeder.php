<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Submenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubmenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $submenus = [
            //AFILIADOS
            [
                ['key' => 'dataEntry', 'name' => 'Data entry'],
                ['key' => 'consultaAfiliados', 'name' => 'Consulta de afiliados'],
            ],
            [
                //BENEFICIOS
                ['key' => 'natalidad', 'name' => 'Natalidad'],
                ['key' => 'lunaDeMiel', 'name' => 'Luna de miel'],
                ['key' => 'casamiento', 'name' => 'Casamiento'],
            ],
            [
                //ORDENES
                ['key' => 'cotizaciones', 'name' => 'Cotizaciones'],
                ['key' => 'ordenes', 'name' => 'Ordenes'],
                ['key' => 'equiposDeVentas', 'name' => 'Equipos de ventas'],
            ],
            [
                //POR FACTURAR
                ['key' => 'ordenesAFacturar', 'name' => 'Ordenes a facturar'],
                ['key' => 'ordenesParaCrearVentasAdicionales', 'name' => 'Ordenes para crear ventas adicionales'],
            ],
            [
                //CLIENTES
                ['key' => 'consultaDeClientes', 'name' => 'Consulta de clientes'],
                ['key' => 'notasDeDebito', 'name' => 'Notas de debito'],
                ['key' => 'notasDeCredito', 'name' => 'Notas de credito'],
            ],
            [
                //PROVEEDORES
                ['key' => 'consultaDeProveedores', 'name' => 'Consulta de proveedores'],
                ['key' => 'notasDeDebitoProveedores', 'name' => 'Notas de debito'],
                ['key' => 'notasDeCreditoProveedores', 'name' => 'Notas de credito'],

            ],
            [
                //CONTABILIDAD
                ['key' => 'consultaDeCuentas', 'name' => 'Consulta de cuentas'],
                ['key' => 'consultaDeAsientos', 'name' => 'Consulta de asientos'],
                ['key' => 'consultaDeAsientosPorCuenta', 'name' => 'Consulta de asientos por cuenta'],
            ],
        ];

        $menus = Menu::all();

        try
        {
            foreach ($submenus as $key => $submenu)
            {
                foreach ($submenu as $data)
                {
                    $result = Submenu::create(['key' => $data['key'], 'name' => $data['name'], 'guard_name' => 'web']);
                    DB::table('menu_has_submenus')
                        ->insert([
                            'submenu_id' => $result->id,
                            'menu_id' => $menus[$key]->id,
                        ]);
                }
            }
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar el submenú al menú: ' . $th->getMessage());
            throw $th;
        }
    }
}
