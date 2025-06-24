<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;

class MovimientosStock extends Model
{
    protected $table='inventario_movimientos_stock';
    public $timestamps = false;

    
    protected $fillable = [
    
        'producto_id',
        'origen_id',
        'destino_id',
        'cantidad',
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
