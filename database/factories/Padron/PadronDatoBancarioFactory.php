<?php

namespace Database\Factories\Padron;;

use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\EntidadFinanciera;
use App\Models\General\TipoMoneda;
use App\Models\Padron\PadronDatoBancario;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PadronDatoBancarioFactory extends Factory
{
    protected $model = PadronDatoBancario::class;

    public function definition(): array
    {
        $usuarioId = User::inRandomOrder()->value('id');

        $proveedor = Proveedor::inRandomOrder()->first()
            ?? Proveedor::factory()->create();

        $cliente = Cliente::inRandomOrder()->first()
            ?? Cliente::factory()->create();    

        $entidad = EntidadFinanciera::inRandomOrder()->first()
            ?? EntidadFinanciera::factory()->create();

        $moneda = TipoMoneda::where('habilitado', true)->inRandomOrder()->first()
            ?? TipoMoneda::factory()->create(['habilitado' => true]);    

        $isCbu = strlen($entidad->clave_unica) === 3;

        return [
            'tipo' => $this->faker->randomElement(['Cliente', 'Proveedor']),
            'tipo_id' => $this->faker->randomElement([$proveedor->id, $cliente->id]),
            'tipo_clave' => $isCbu ? 'Cbu' : 'Cvu',
            'clave' => $this->faker->unique()->numerify(str_repeat('#', 22)),
            'alias' => $this->faker->boolean(70)
                ? $this->faker->unique()->slug(3)
                : null,
            'entidad_financiera' => $entidad->id,
            'moneda' => $moneda->id,
            'tipo_cuenta' => $isCbu
                ? $this->faker->randomElement(['Caja de Ahorro', 'Cuenta Corriente'])
                : 'Undefined',
            'predeterminado' => $this->faker->boolean(60),
            'fecha_creacion' => now(),
            'usuario_creacion' => $usuarioId,
            'fecha_actualizacion' => null,
            'usuario_actualizacion' => null,
        ];
    }
}
