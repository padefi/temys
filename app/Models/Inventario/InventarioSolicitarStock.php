<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventarioSolicitarStock extends Model
{
    use HasFactory;



    public $timestamps = false;

    protected $fillable = [
      /*   'producto_id', */
        'almacen_solicitante_id',
        'almacen_proveedor_id',
  /*       'cantidad',
        'cantidad_aprobada', */
        'prioridad',
        'estado',
        'motivo',
        'fecha_creacion',
        'usuario_creacion',
    ];



    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function almacensolicitante()
    {
        return $this->belongsTo(Almacen::class, 'almacen_solicitante_id');
    }

    public function almacenProovedor()
    {
        return $this->belongsTo(Almacen::class, 'almacen_proveedor_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }


     public function detalles()
    {
        return $this->hasMany(InventarioSolicitudDetalle::class, 'solicitud_id');
    }
    // InventarioSolicitarStock.php
/* 
    public function ordenEntrega()
    {
        return $this->hasOne(InventarioOrdenEntrega::class, 'solicitud_id');
    }

    public function recepcion()
    {
        return $this->hasOne(InventarioRecepcionProducto::class, 'solicitud_id');
    } */
}
