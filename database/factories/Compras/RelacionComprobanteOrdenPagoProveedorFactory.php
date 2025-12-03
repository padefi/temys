<?php
// database/factories/ComprobantePagoFactory.php
namespace Database\Factories\Compras;

use App\Models\Compras\RelacionComprobanteOrdenPagoProveedor;
use App\Models\Compras\ComprobanteProveedor;
use App\Models\Compras\OrdenPago;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelacionComprobanteOrdenPagoProveedorFactory extends Factory
{
    protected $model = RelacionComprobanteOrdenPagoProveedor::class;

    public function definition(): array
    {
        return [
            'comprobante_id' => ComprobanteProveedor::factory(),
            'orden_pago_id' => OrdenPago::factory(),
            'importe_aplicado' => $this->faker->randomFloat(2, 50, 500),
            'fecha_aplicacion' => $this->faker->date(),
        ];
    }
}
