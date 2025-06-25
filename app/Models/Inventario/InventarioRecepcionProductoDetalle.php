<?php

namespace App\Models\Inventario;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioRecepcionProductoDetalle extends Model
{
    protected $table = 'inventario_recepcion_productos_detalle';

    public $timestamps = false;

    protected $fillable = [
        'recepcion_producto_id',
        'producto_id',
        'cantidad_recibida',
        'cantidad_esperada',
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

    public function recepcion()
    {
        return $this->belongsTo(InventarioRecepcionProducto::class, 'recepcion_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
