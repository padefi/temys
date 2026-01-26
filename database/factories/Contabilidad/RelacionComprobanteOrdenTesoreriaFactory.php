<?php
// database/factories/ComprobantePagoFactory.php
namespace Database\Factories\Contabilidad;

use App\Models\Contabilidad\RelacionComprobanteOrdenTesoreria;
use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\OrdenTesoreria;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionComprobanteOrdenTesoreriaFactory extends Factory
{
    protected $model = RelacionComprobanteOrdenTesoreria::class;

    public function definition(): array
    {
        return [
            'comprobante_id' => Comprobante::factory(),
            'orden_tesoreria_id' => OrdenTesoreria::factory(),
            'importe_aplicado' => $this->faker->randomFloat(2, 50, 500),
            'fecha_aplicacion' => $this->faker->date(),
        ];
    }
}
