<?php

namespace App\Models\Ventas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudVentaOrdenCotizacionVenta extends Model
{
    use HasFactory;
    protected $table = 'solicitud_venta_orden_cotizaciones';

    protected $fillable = [
        'solicitud_venta_id',
        'orden_cotizaciones_ventas_id',
    ];
    ////SOLICITUD DE VENTA RELACIONADA
    public function solicitudVenta()
    {
        return $this->belongsTo(SolicitudVenta::class, 'solicitud_venta_id');
    }

    ////ORDEN DE COTIZACION RELACIONADA
    public function ordenCotizacionVenta()
    {
        return $this->belongsTo(OrdenCotizacionVenta::class, 'orden_cotizaciones_ventas_id');
    }
}
