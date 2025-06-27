<?php

namespace Database\Seeders;

use App\Models\Almacenes\Almacen;
use Illuminate\Database\Seeder;



class AlmacenSeeder extends Seeder
{
    public function run(): void
    {
    
    Almacen::factory()->count(10)->create();

    }
}
