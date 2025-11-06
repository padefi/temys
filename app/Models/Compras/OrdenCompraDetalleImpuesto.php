<?php

namespace App\Models\Compras;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompraDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'orden_compras_detalles_impuestos';

    public $timestamps = false;

    protected $fillable = [
        'orden_compras_detalles_id',
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
    ////ORDEN COMPRA DETALLE RELACIONADO
    public function ordenCompraDetalle()
    {
        return $this->belongsTo(OrdenCompraDetalle::class, 'orden_compras_detalles_id');
    }

}
