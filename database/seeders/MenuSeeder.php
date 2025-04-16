<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Menu;
use App\Models\ControlAcceso\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            //CONTROL DE ACCESO
            [
                ['key' => 'usuarios', 'name' => 'Usuarios'],
                ['key' => 'roles', 'name' => 'Roles'],
                ['key' => 'modulos', 'name' => 'Modulos'],
                ['key' => 'menus', 'name' => 'Menus'],
                ['key' => 'submenus', 'name' => 'Submenus'],
            ],
            //AFILIADOS
            [
                ['key' => 'afiliados', 'name' => 'Afiliados'],
                ['key' => 'beneficios', 'name' => 'Beneficios'],
                ['key' => 'fondoDeSepelio', 'name' => 'Fondo de sepelio'],
                ['key' => 'pas', 'name' => 'P.A.S.'],
                ['key' => 'turismo', 'name' => 'Turismo'],
            ],
            [
                //VENTAS
                ['key' => 'ordenes', 'name' => 'Ordenes'],
                ['key' => 'porFacturar', 'name' => 'Por facturar'],
                ['key' => 'productos', 'name' => 'Productos'],
                ['key' => 'reportes', 'name' => 'Reportes'],
                ['key' => 'configuracion', 'name' => 'Configuracion'],
            ],
            [
                //CONTABILIDAD
                ['key' => 'tablero', 'name' => 'Tablero'],
                ['key' => 'clientes', 'name' => 'Clientes'],
                ['key' => 'proveedores', 'name' => 'Proveedores'],
                ['key' => 'contabilidad', 'name' => 'Contabilidad'],
                ['key' => 'reportes', 'name' => 'Reportes'],
                ['key' => 'configuracion', 'name' => 'Configuracion'],
            ],
        ];

        $modules = Module::all();

        try
        {
            foreach ($menus as $key => $menu)
            {
                foreach ($menu as $data)
                {
                    $result = Menu::create(['key' => $data['key'], 'name' => $data['name'], 'guard_name' => 'web']);
                    DB::table('module_has_menus')
                        ->insert([
                            'menu_id' => $result->id,
                            'module_id' => $modules[$key]->id,
                        ]);
                }
            }
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar el menú al módulo: ' . $th->getMessage());
            throw $th;
        }
    }
}
