<?php
// database/factories/TarjetaFactory.php
namespace Database\Factories\General;

use App\Models\General\Tarjeta;
use App\Models\General\CuentaBancaria;
use Illuminate\Database\Eloquent\Factories\Factory;

class TarjetaFactory extends Factory
{
    protected $model = Tarjeta::class;

    public function definition(): array {
        return [
            'tipo' => $this->faker->randomElement(['Visa', 'Mastercard', 'Amex']),
            'numero_tarjeta' => $this->faker->creditCardNumber,
            'cuenta_bancaria_id' => CuentaBancaria::factory(),
            'vencimiento' => $this->faker->creditCardExpirationDate,
            'nombre_titular' => $this->faker->name,
            'cuenta' => $this->faker->iban('AR'),
        ];
    }
}

