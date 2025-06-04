<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\RoleModule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;

class RoleModulePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $encargadoRole = RoleModule::findByName('encargado');
        // $auxiliarRole = RoleModule::findByName('auxiliar');
        $administrativoRole = RoleModule::findByName('administrativo');

        try
        {
            $encargadoRole->syncPermissions(Permission::all());
            // $auxiliarRole->syncPermissions(Permission::all());
            // $administrativoRole->syncPermissions(Permission::whereNotIn('name', ['confirm', 'avoid', 'restore'])->get());
        }
        catch (\Throwable $th)
        {
            Log::error('Error al asignar permisos a los roles: ' . $th->getMessage());
            throw $th;
        }
    }
}
