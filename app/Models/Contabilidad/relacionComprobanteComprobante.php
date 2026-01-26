<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\Comprobante;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RelacionComprobanteComprobante extends Model
{
    use HasFactory;

    protected $table = 'relacion_comprobante_comprobante';

    protected $fillable = [
        'comprobante_origen_id',
        'comprobante_destino_id',
        'importe_aplicado',
        'fecha_aplicacion',
    ];

    public function comprobanteOrigen()
    {
        return $this->belongsTo(
            Comprobante::class,

            'comprobante_origen_id'
        );
    }

    public function comprobanteDestino()
    {
        return $this->belongsTo(
            Comprobante::class,
            'comprobante_destino_id'
        );
    }
}
