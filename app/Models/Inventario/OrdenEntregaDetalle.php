<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;

class OrdenEntregaDetalle extends Model
{
    protected $table='inventario_orden_entrega_detalle';
    public $timestamps = false;

    
    protected $fillable = [
    
        'orden_entrega_id',
        'producto_id',
        'cantidad_enviada',
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
