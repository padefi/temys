<?php

namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\Comprobante;
use App\Models\ControlAcceso\User;
use App\Models\General\CondicionVenta;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComprobanteFactory extends Factory
{
    protected $model = Comprobante::class;

    public function definition(): array
    {
        $usuario = User::inRandomOrder()->first();
        $condicionVenta = CondicionVenta::inRandomOrder()->first();

        return [
            'tipo' => $this->faker->randomElement(['cliente', 'proveedor']),
            'tipo_id' => $this->faker->randomElement([Proveedor::inRandomOrder()->value('id') ?? Proveedor::factory(), Cliente::inRandomOrder()->value('id') ?? Cliente::factory()]),
            'fecha_factura' => $this->faker->date(),
            'fecha_vencimiento' => $this->faker->date('+30 days'),
            'condicion_venta_id' => $condicionVenta->id,
            'moneda_id' => $this->faker->randomElement([1, 2]),
            'punto_venta' => $this->faker->numerify('000#'),
            'numero_factura' => $this->faker->numberBetween(1000, 9999),
            'tipo_comprobante' => $this->faker->randomElement(['Factura A', 'Factura B', 'Recibo']),
            'estado' => $this->faker->randomElement(['Pendiente', 'Confirmada', 'Cancelada']),
            'descripcion' => $this->faker->sentence(),
            'usuario_creacion' => $usuario->id,
        ];
    }
}
