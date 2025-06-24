<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table='inventario_stock';
    public $timestamps = false;

    
    protected $fillable = [
    
        'producto_id',
        'almacen_id',
        'cantidad_actual',
        'stock_minimo',
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
