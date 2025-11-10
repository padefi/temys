<?php
namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionComprobanteOrdenPagoProveedor extends Model
{
    use HasFactory;

    protected $table = 'relacion_comprobante_orden_pago_proveedores';

    protected $fillable = [
        'comprobante_id',
        'orden_pago_id',
        'importe_aplicado',
        'fecha_aplicacion',
    ];
    ////COMPROBANTE PROVEEDOR RELACIONADO
    public function comprobanteProveedor()
    {
        return $this->belongsTo(ComprobanteProveedor::class, 'comprobante_id');
    }
    ////ORDEN DE PAGO RELACIONADA
    public function ordenPago()
    {
        return $this->belongsTo(OrdenPago::class, 'orden_pago_id');
    }
}
