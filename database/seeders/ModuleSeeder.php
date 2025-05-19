<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enabledModules  = config('module.enabled_modules', []);
        $guardName = 'web';

        DB::beginTransaction();

        try
        {
            foreach ($enabledModules as $module)
            {
                Module::create(['key' => $module['key'], 'name' => $module['name'], 'guard_name' => $guardName]);
            }

            DB::commit();
        }
        catch (\Throwable $th)
        {
            DB::rollBack();
            Log::error('Error al crear los modulos: ' . $th->getMessage());
        }
    }
}
