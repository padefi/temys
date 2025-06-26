<?php

namespace App\Models\Patrimonio;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class Patrimonio extends Model
{
   
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

     public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}
