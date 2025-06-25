<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class Inventario_stock extends Model
{
    
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

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }
}
