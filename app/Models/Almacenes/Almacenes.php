<?php

namespace App\Models\Almacenes;

use Illuminate\Database\Eloquent\Model;

class Almacenes extends Model
{
    // Desactivar timestamps automáticos (created_at y updated_at)
    public $timestamps = false;

    
    protected $fillable = [
    
        'nombre',
        'tipo',
        'responsable_id',
        'almacen_padre_id',
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
