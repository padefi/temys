<?php

// database/seeders/ChequeSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Cheque;

class ChequeSeeder extends Seeder
{
    public function run(): void {
        Cheque::factory(30)->create();
    }
}
