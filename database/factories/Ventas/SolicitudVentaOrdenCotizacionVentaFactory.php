<?php

namespace Database\Factories\Ventas;

use App\Models\Ventas\ordenCotizacionVenta;
use App\Models\Ventas\solicitudVenta;
use App\Models\Ventas\SolicitudVentaOrdenCotizacionVenta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SolicitudVentaOrdenCotizacionVenta>
 */
class SolicitudVentaOrdenCotizacionVentaFactory extends Factory
{
    protected $model = SolicitudVentaOrdenCotizacionVenta::class;

    public function definition(): array
    {
        return [
            'solicitud_venta_id' => solicitudVenta::factory(),
            'orden_cotizaciones_ventas_id' => ordenCotizacionVenta::factory(),
        ];
    }
}
