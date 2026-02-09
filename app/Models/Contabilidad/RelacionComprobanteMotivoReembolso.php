<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Model;

class RelacionComprobanteMotivoReembolso extends Model
{
    protected $table = 'relacion_comprobante_motivo_reembolso';

    protected $fillable = [
        'comprobante_id',
        'motivo_reembolso_id',
        'observaciones',
        'usuario_id',
    ];

    public function comprobantes()
    {
        return $this->hasMany(
            RelacionComprobanteMotivoReembolso::class,
            'motivo_reembolso_id'
        );
    }
}
