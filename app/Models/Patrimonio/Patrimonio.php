<?php

namespace App\Models\Patrimonio;

use Illuminate\Database\Eloquent\Model;

class Patrimonio extends Model
{
    // Desactivar timestamps automáticos (created_at y updated_at)
    public $timestamps = false;

    
    protected $fillable = [
    
        'producto_id',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];
}
