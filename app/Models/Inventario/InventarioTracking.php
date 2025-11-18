<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioTracking extends Model
{
    protected $table = 'inventario_tracking';

    protected $fillable = [
        'entrega_id',
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

    public function ordenEntrega()
    {
        return $this->belongsTo(InventarioOrdenEntrega::class, 'entrega_id');
    }
    public function ultimoEstado()
    {
        return $this->hasOne(InventarioOrdenEntrega::class, 'entrega_id')->latest('fecha');
    }
    public function movimientoEstados()
    {
        return $this->hasMany(InventarioEstadosTracking::class, 'seguimiento_id');
    }
    

}
