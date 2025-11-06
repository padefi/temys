<?php

namespace App\Models\Compras;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteProveedorDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'comprobantes_proveedores_detalles_impuestos';

    protected $fillable = [
        'detalle_id',
        'impuesto_id',
    ];
    ////COMPROBANTE PROVEEDOR DETALLE RELACIONADO
    public function detalle() {
        return $this->belongsTo(ComprobanteProveedorDetalle::class, 'detalle_id');
    }
    ////IMPUESTO RELACIONADO
    public function impuesto() {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
}
