<?php

namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RelacionComprobanteComprobanteProveedor extends Model
{
    use HasFactory;

    protected $table = 'relacion_comprobante_comprobante_proveedores';

    protected $fillable = [
        'comprobante_origen_id',
        'comprobante_destino_id',
        'importe_aplicado',
        'fecha_aplicacion',
    ];

    public function comprobanteOrigen()
    {
        return $this->belongsTo(
            ComprobanteProveedor::class,

            'comprobante_origen_id'
        );
    }

    public function comprobanteDestino()
    {
        return $this->belongsTo(
            ComprobanteProveedor::class,
            'comprobante_destino_id'
        );
    }
}
