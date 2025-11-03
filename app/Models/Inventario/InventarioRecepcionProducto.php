<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class InventarioRecepcionProducto extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'origen_id',
        'destino_id',
        'orden_entrega_id',
        'tipo_recepcion',
        'fecha_recepcion',
        'estado',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    
    public function origen()
    {
        return $this->belongsTo(Almacen::class, 'origen_id');
    }

    public function destino()
    {
        return $this->belongsTo(Almacen::class, 'destino_id');
    }


    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function detalles()
    {
        return $this->hasMany(InventarioRecepcionProductoDetalle::class, 'recepcion_id');
    }

public function ordenEntrega()
{
    return $this->belongsTo(InventarioOrdenEntrega::class, 'orden_entrega_id');
}


    // InventarioRecepcionProducto.php
  /*   public function solicitud()
    {
        return $this->belongsTo(InventarioSolicitarStock::class, 'solicitud_id');
    } */

     public function movimientos()
    {
        return $this->belongsToMany(InventarioMovimientoStock::class, 'relacion_movimiento_recepcion', 'recepcion_id', 'movimiento_id');
    }

    
    public function cancelacion()
    {
        return $this->hasOne(InventarioRecepcionCancelada::class, 'recepcion_id');
    }
}
