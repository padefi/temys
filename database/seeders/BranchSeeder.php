<?php

namespace Database\Seeders;

use App\Models\ControlAcceso\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Secretaria central',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Tapiales',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Remedios de escalada',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Retiro',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Constitucion',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Mar del plata',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'Cordoba',
                'street_id' => null,
                'number' => null,
                'phone' => null,
                'email' => null,
                'status' => 'active',
                'model_id_created' => 1,
                'created_at' => now(),
            ],
        ];

        foreach ($branches as $branch)
        {
            Branch::create([
                'name' => $branch['name'],
                'street_id' => $branch['street_id'],
                'number' => $branch['number'],
                'phone' => $branch['phone'],
                'email' => $branch['email'],
                'status' => $branch['status'],
                'model_id_created' => $branch['model_id_created'],
                'created_at' => $branch['created_at'],
                'updated_at' => null,
            ]);
        }
    }
}
