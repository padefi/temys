<?php

namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;


class SolicitudCompraOrdenCotizacion extends Model
{
    use HasFactory;
    protected $table = 'solicitud_compra_orden_cotizaciones';

    protected $fillable = [
        'solicitud_compra_id',
        'orden_cotizaciones_id',
    ];


    public function solicitudCompra()
    {
        return $this->belongsTo(SolicitudCompra::class, 'solicitud_compra_id');
    }

    public function ordenCotizacion()
    {
        return $this->belongsTo(OrdenCotizacion::class, 'orden_cotizaciones_id');
    }
}
