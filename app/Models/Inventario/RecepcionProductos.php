<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;

class RecepcionProductos extends Model
{
    protected $table='inventario_recepcion_productos';
    public $timestamps = false;

    
    protected $fillable = [
    
        'origen_id',
        'destino_id',
        'tipo_movimiento',
        'movimiento_id',
        'fecha_recepcion',
        'estado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];
}
