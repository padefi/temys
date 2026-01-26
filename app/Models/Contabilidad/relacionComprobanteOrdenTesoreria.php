<?php
namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionComprobanteOrdenTesoreria extends Model
{
    use HasFactory;

    protected $table = 'relacion_comprobante_orden_tesoreria';

    protected $fillable = [
        'comprobante_id',
        'orden_tesoreria_id',
        'importe_aplicado',
        'fecha_aplicacion',
    ];
    ////COMPROBANTE RELACIONADO
    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class, 'comprobante_id');
    }
    ////ORDEN DE PAGO RELACIONADA
    public function ordenTesoreria()
    {
        return $this->belongsTo(OrdenTesoreria::class, 'orden_tesoreria_id');
    }
}
