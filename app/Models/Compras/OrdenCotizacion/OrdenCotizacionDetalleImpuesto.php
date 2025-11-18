<?php

namespace App\Models\Compras\OrdenCotizacion;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacionDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'orden_cotizacion_detalle_impuestos';

    public $timestamps = false;

    protected $fillable = [
        'orden_cotizaciones_detalles_id',
        'impuesto_id',
    ];

    protected $casts = [

    ];


    ////ORDEN DE COTIZACIÓN DETALLE RELACIONADO
    public function ordenCotizacionDetalle()
    {
        return $this->belongsTo(OrdenCotizacionDetalle::class, 'orden_cotizaciones_detalles_id');
    }
    ////IMPUESTO RELACIONADO
    public function impuesto()
    {
        return $this->hasMany(Impuesto::class, 'impuesto_id');
    }

}
