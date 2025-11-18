<?php

namespace Database\Factories\General;

use App\Models\General\TipoComprobante;
use Illuminate\Database\Eloquent\Factories\Factory;

class TipoComprobanteFactory extends Factory
{
     protected $model = TipoComprobante::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->word(),
            'codigo_arca' => $this->faker->randomElement(['001','002','003','004','006','008',null]),
            'signo' => $this->faker->randomElement(['debe','haber']),
            'categoria' => $this->faker->randomElement(['factura','nota_credito','nota_debito','anticipo','recibo','otros']),
            'afecta_saldo' => $this->faker->boolean(90),
            'habilitado' => true,
        ];
    }
}
