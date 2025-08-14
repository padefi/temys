<?php

namespace App\Models\Inventario;


use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventarioMovimientoStock extends Model
{
     use HasFactory;
    public $timestamps = false;
    
    protected $fillable = [
        'producto_id',
        'origen_id',
        'destino_id',
        'cantidad',
        'tipo_movimiento',
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

    public function almacenOrigen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_origen_id');
    }

    public function almacenDestino()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }

       public function ajusteInventarioDetalle()
    {
        return $this->hasOne(InventarioAjusteDetalle::class, 'movimiento_id');
    }

    public function recepciones()
    {
        return $this->belongsToMany(InventarioRecepcionProducto::class, 'relacion_movimiento_recepcion', 'movimiento_id', 'recepcion_id');
    }

    public function entregas()
    {
        return $this->belongsToMany(InventarioOrdenEntrega::class, 'relacion_movimiento_entrega', 'movimiento_id', 'entrega_id');
    
}
}