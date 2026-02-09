<?php

namespace App\Models\Ventas;

use App\Models\General\Impuesto;
use App\Models\Ventas\OrdenVentaDetalle;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ordenVentaDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'orden_venta_detalle_impuestos';

    public $timestamps = false;

    protected $fillable = [
        'orden_ventas_detalles_id',
        'impuesto_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    ////IMPUESTO RELACIONADO
    public function impuesto()
    {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
    ////ORDEN VENTA DETALLE RELACIONADO
    public function ordenVentaDetalle()
    {
        return $this->belongsTo(OrdenVentaDetalle::class, 'orden_ventas_detalles_id');
    }

}
