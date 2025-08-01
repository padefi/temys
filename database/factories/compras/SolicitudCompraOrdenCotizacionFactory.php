<?php

namespace Database\Factories\Compras;

use App\Models\Compras\SolicitudCompraOrdenCotizacion;
use App\Models\Compras\SolicitudCompra;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use Illuminate\Database\Eloquent\Factories\Factory;

class SolicitudCompraOrdenCotizacionFactory extends Factory
{
    protected $model = SolicitudCompraOrdenCotizacion::class;

    public function definition(): array
    {
        return [
            'solicitud_compra_id' => SolicitudCompra::factory(),
            'orden_cotizacion_id' => OrdenCotizacion::factory(),
        ];
    }
}
