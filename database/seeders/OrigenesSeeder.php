<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Origenes;

class OrigenesSeeder extends Seeder
{
    public function run(): void
    {
        Origenes::factory()->count(20)->create();
    }
}
