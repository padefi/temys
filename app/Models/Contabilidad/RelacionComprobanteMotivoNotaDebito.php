<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Model;

class RelacionComprobanteMotivoNotaDebito extends Model
{
    protected $table = 'relacion_comprobante_motivo_nota_debito';

    protected $fillable = [
        'comprobante_id',
        'motivo_nota_debito_id',
        'observaciones',
        'usuario_id',
    ];

    public function comprobantes()
    {
        return $this->hasMany(
            RelacionComprobanteMotivoNotaDebito::class,
            'motivo_nota_debito_id'
        );
    }
}
