<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Compras\ComprobanteProveedor;
use App\Models\Contabilidad\Asientos\Partida;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionComprobantePartida extends Model
{
    use HasFactory;
    protected $table = 'relacion_comprobante_partida';

    protected $fillable = [
        'comprobante_id',
        'partida_id',
        'importe_aplicado',
        'fecha_aplicacion',
    ];

    public function comprobante()
    {
        return $this->belongsTo(ComprobanteProveedor::class, 'comprobante_id');
    }

    public function partida()
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }
}
