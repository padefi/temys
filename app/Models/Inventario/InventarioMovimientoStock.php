<?php

namespace App\Models\Inventario;
use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioMovimientoStock extends Model
{
    
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
}
