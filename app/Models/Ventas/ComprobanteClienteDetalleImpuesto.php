<?php

namespace App\Models\Ventas;

use App\Models\General\Impuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteClienteDetalleImpuesto extends Model
{
    use HasFactory;
    protected $table = 'comprobantes_clientes_detalles_impuestos';

    protected $fillable = [
        'detalle_id',
        'impuesto_id',
    ];
    ////COMPROBANTE CLIENTE DETALLE RELACIONADO
    public function detalle() {
        return $this->belongsTo(ComprobanteClienteDetalle::class, 'detalle_id');
    }
    ////IMPUESTO RELACIONADO
    public function impuesto() {
        return $this->belongsTo(Impuesto::class, 'impuesto_id');
    }
}
