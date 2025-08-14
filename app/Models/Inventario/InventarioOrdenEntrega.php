<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;
use App\Models\Inventario\InventarioOrdenEntregaDetalle;

class InventarioOrdenEntrega extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'origen_id',
        'destino_id',
        'movimiento_id',
        'tipo_movimiento',
        'fecha_envio',
        'estado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_envio' => 'date',
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

   /*  public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    } */

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    public function detalles()
    {
        return $this->hasMany(inventarioOrdenEntregaDetalle::class, 'orden_entrega_id');
    }


    // InventarioOrdenEntrega.php
/*     public function solicitud()
    {
        return $this->belongsTo(InventarioSolicitarStock::class, 'solicitud_id');
    } */

      public function movimientos()
    {
        return $this->belongsToMany(InventarioMovimientoStock::class, 'relacion_movimiento_entrega', 'entrega_id', 'movimiento_id');
    }
}
