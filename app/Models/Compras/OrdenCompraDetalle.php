<?php

namespace App\Models\Compras;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class OrdenCompraDetalle extends Model
{
    protected $table = 'ordenes_compra_detalle';
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

        public function ordenCompra()
    {
        return $this->belongsTo(OrdenCompra::class, 'orden_compra_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
