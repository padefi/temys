<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Impuesto;

class ImpuestoSeeder extends Seeder
{
    public function run(): void
    {
        Impuesto::factory()->count(10)->create();
    }
}
