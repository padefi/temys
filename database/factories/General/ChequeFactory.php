<?php
// database/factories/ChequeFactory.php
namespace Database\Factories\General;

use App\Models\General\Cheque;
use App\Models\General\CuentaBancaria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChequeFactory extends Factory
{
    protected $model = Cheque::class;

    public function definition(): array {
        return [
            'numero' => $this->faker->numerify('########'),
            'cuenta_bancaria_id' => CuentaBancaria::factory(),
        ];
    }
}

