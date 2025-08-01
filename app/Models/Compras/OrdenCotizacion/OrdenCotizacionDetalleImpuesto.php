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
        'orden_cotizaciones_detalle_id',
        'impuesto_id',
    ];

    protected $casts = [

    ];




    public function ordenCotizacionDetalle()
    {
        return $this->belongsTo(OrdenCotizacionDetalle::class, 'orden_cotizaciones_detalle_id');
    }

     public function impuesto()
    {
        return $this->hasMany(Impuesto::class, 'impuesto_id');
    }

}
