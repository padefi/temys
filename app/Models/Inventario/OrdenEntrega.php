<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;

class OrdenEntrega extends Model
{
    protected $table='inventario_orden_entrega';
    public $timestamps = false;

    
    protected $fillable = [
    
        'origen_id',
        'destino_id',
        'fecha_envio',
        'estado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_envio' => 'datetime',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];
}
