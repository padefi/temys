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
        'cantidad',
        'estado',
        'ubicacion_actual',
        'fecha_salida',
        'usuario_id',
    ];

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
}
