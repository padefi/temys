<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioStockTransito extends Model
{
      protected $table = 'inventario_stock_transito';

    protected $fillable = [
        'movimiento_id',
        'producto_id',
        'origen_id',
        'destino_id',
        'cantidad',
        'estado',
        'ubicacion_actual',
        'fecha_salida',
        'fecha_llegada',
        'observaciones',
    ];

    protected $casts = [
        'fecha_salida' => 'datetime',
        'fecha_llegada' => 'datetime',
    ];

    public $timestamps = false;
    
    public function movimiento()
    {
        return $this->belongsTo(InventarioMovimientoStock::class, 'movimiento_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function origen()
    {
        return $this->belongsTo(Almacen::class, 'origen_id');
    }

    public function destino()
    {
        return $this->belongsTo(Almacen::class, 'destino_id');
    }
    public function movimientoEstados()
{
    return $this->belongsTo(InventarioMovimientoEstado::class, 'id', 'transito_id');
}

}
