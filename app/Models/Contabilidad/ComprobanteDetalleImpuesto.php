<?php

namespace App\Models\Contabilidad;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'comprobantes_detalles_impuestos';

    protected $fillable = [
        'detalle_id',
        'impuesto_id',
    ];
    ////COMPROBANTE DETALLE RELACIONADO
    public function detalle() {
        return $this->belongsTo(ComprobanteDetalle::class, 'detalle_id');
    }
    ////IMPUESTO RELACIONADO
    public function impuesto() {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
}
