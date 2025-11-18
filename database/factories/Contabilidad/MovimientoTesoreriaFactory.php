<?php

namespace Database\Factories\Contabilidad;

use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\General\Banco;
use App\Models\General\MetodoPago;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class MovimientoTesoreriaFactory extends Factory
{
    protected $model = MovimientoTesoreria::class;

    public function definition(): array
    {
        return [
            'fecha' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'tipo_movimiento' => $this->faker->randomElement(['entrada', 'salida']),
            'monto' => $this->faker->randomFloat(2, 1000, 100000),
            'metodo_pago_id' => MetodoPago::inRandomOrder()->value('id'),
            'tipo_moneda_id' => TipoMoneda::inRandomOrder()->value('id'),
            'banco_id' => Banco::inRandomOrder()->value('id'),
            'cuenta_bancaria_id' => CuentaBancaria::inRandomOrder()->value('id'),
            'orden_pago_id' => OrdenPago::inRandomOrder()->value('id'),
            'proveedor_id' => Proveedor::inRandomOrder()->value('id'),
            'usuario_id' => User::inRandomOrder()->value('id'),
            'descripcion' => $this->faker->sentence(),
            'referencia_bancaria' => $this->faker->uuid(),
            'conciliado' => false,
            'fecha_conciliado' => now(),
            'usuario_conciliado_id' => User::inRandomOrder()->value('id'),
        ];
    }
}
