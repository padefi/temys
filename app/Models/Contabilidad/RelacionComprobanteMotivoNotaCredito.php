<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Model;

class RelacionComprobanteMotivoNotaCredito extends Model
{
    protected $table = 'relacion_comprobante_motivo_nota_credito';

    protected $fillable = [
        'comprobante_id',
        'motivo_nota_credito_id',
        'observaciones',
        'usuario_id',
    ];

    public function comprobantes()
    {
        return $this->hasMany(
            RelacionComprobanteMotivoNotaCredito::class,
            'motivo_nota_credito_id'
        );
    }
}
