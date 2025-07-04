<?php

namespace Database\Seeders;

use App\Models\Almacenes\Almacen;
use Illuminate\Database\Seeder;



class almacenSeeder extends Seeder
{
    public function run(): void
    {
    
    Almacen::factory()->count(10)->create();

    }
}
