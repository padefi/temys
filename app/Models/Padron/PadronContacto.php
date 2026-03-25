<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Model;

class PadronContacto extends Model
{
    protected $table = 'padron_contactos';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'tipo_id',
        'tipo_contacto',
        'contacto',
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
