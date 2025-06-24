<?php

namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Model;

class OrdenesCompraDetalle extends Model
{
    // Desactivar timestamps automáticos (created_at y updated_at)
    public $timestamps = false;

    
    protected $fillable = [
    
        'orden_compra_id',
        'producto_id',
        'cantidad_solicitada',
        'precio',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
        'precio'=>'float',
    ];
}
