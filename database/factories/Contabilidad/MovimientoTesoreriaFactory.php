<?php

namespace Database\Factories\Contabilidad;

use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\MovimientoTesoreria;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\General\Banco;
use App\Models\General\MetodoTesoreria;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

class MovimientoTesoreriaFactory extends Factory
{
    protected $model = MovimientoTesoreria::class;

    public function definition(): array
    {
        return [
            'tipo' => $this->faker->randomElement(['cliente', 'proveedor']),
            'tipo_id' => $this->faker->randomElement(['cliente' => Cliente::inRandomOrder()->value('id'), 'proveedor' => Proveedor::inRandomOrder()->value('id')]),
            'fecha_movimiento' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'fecha_aplicacion' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'tipo_movimiento' => $this->faker->randomElement(['entrada', 'salida']),
            'monto' => $this->faker->randomFloat(2, 1000, 100000),
            'metodo_id' => MetodoTesoreria::inRandomOrder()->value('id'),
            'tipo_moneda_id' => TipoMoneda::inRandomOrder()->value('id'),
            'banco_id' => Banco::inRandomOrder()->value('id'),
            'cuenta_bancaria_id' => CuentaBancaria::inRandomOrder()->value('id'),
            'orden_id' => OrdenTesoreria::inRandomOrder()->value('id'),
            'usuario_id' => User::inRandomOrder()->value('id'),
            'descripcion' => $this->faker->sentence(),
            'referencia_bancaria' => $this->faker->uuid(),
            'conciliado' => false,
            'fecha_conciliado' => now(),
            'usuario_conciliado_id' => User::inRandomOrder()->value('id'),
        ];
    }
}
