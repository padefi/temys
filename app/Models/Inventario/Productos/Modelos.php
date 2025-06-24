<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Modelos extends Model
{
    protected $table='productos_modelos';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
        'marca_id',
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
