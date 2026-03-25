<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Model;

class TipoContacto extends Model
{
    protected $table = 'tipo_contactos';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'habilitado',
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
