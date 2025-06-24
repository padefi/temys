<?php

namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Model;

class OrdenesCompra extends Model
{
    // Desactivar timestamps automáticos (created_at y updated_at)
    public $timestamps = false;

    
    protected $fillable = [
    
        'proveedor_id',
        'almacen_destino_id',
        'estado',
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
