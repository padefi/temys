<?php

namespace App\Models\Inventario;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioOrdenEntregaDetalle extends Model
{
    protected $table='inventario_orden_entrega_detalles';
    
    public $timestamps = false;
   
    protected $fillable = [ 
        'orden_entrega_id',
        'producto_id',
        'cantidad_enviada',
  
    ];



    public function ordenEntrega()
    {
        return $this->belongsTo(InventarioOrdenEntrega::class, 'orden_entrega_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
