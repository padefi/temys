<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Model;

class PadronDomicilio extends Model
{
    protected $table = 'padron_domicilios';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'tipo_id',
        'tipo_domicilio',
        'calle_id',
        'altura',
        'codigo_postal',
        'piso',
        'departamento',
        'observaciones',
        'predeterminado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'predeterminado' => 'boolean',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];
}
