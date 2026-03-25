<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Model;
use App\Models\General\TipoAdjunto;

class PadronAdjuntoRequerido extends Model
{
    protected $table = 'padron_adjuntos_requeridos';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'tipo_id',
        'tipo_adjunto',
        'nombre_archivo',
        'ruta_archivo',
        'fecha_adjunto',
        'fecha_carga',
        'usuario_carga',
        'fecha_modificacion',
        'usuario_modificacion',
    ];

    protected $casts = [
        'fecha_adjunto' => 'date',
        'fecha_carga' => 'datetime',
        'fecha_modificacion' => 'datetime',
    ];

    public function tipoAdjunto()
    {
        return $this->belongsTo(TipoAdjunto::class, 'tipo_adjunto');
    }
}
