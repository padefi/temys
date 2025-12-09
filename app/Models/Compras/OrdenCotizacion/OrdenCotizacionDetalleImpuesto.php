<?php

namespace App\Models\Compras\OrdenCotizacion;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacionDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'orden_cotizaciones_detalles_impuestos';

    public $timestamps = false;

    protected $fillable = [
        'orden_cotizaciones_detalles_id',
        'impuesto_id',
    ];

    public function ordenCotizacionDetalle()
    {
        return $this->belongsTo(OrdenCotizacionDetalle::class, 'orden_cotizaciones_detalles_id');
    }

    public function impuesto()
    {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
}





