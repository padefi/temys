<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoComprobante extends Model
{
    use HasFactory;

    protected $table = 'tipo_comprobantes';

        protected $fillable = [
        'nombre',
        'codigo_arca',
        'signo',
        'categoria',
        'afecta_saldo',
        'habilitado',
    ];
}
