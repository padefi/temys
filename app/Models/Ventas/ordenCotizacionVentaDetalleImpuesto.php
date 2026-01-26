<?php

namespace App\Models\Ventas;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ordenCotizacionVentaDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'orden_cotizaciones_ventas_detalles_impuestos';



    public $timestamps = false;

    protected $fillable = [
        'orden_cotizaciones_ventas_detalles_id',
        'impuesto_id',
    ];

    public function ordenCotizacionVentaDetalle()
    {
        return $this->belongsTo(OrdenCotizacionVentaDetalle::class, 'orden_cotizaciones_ventas_detalles_id');
    }

    public function impuesto()
    {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
}
