<?php

namespace App\Models\Compras;

use App\Models\Almacenes\Almacen;
use Illuminate\Database\Eloquent\Model;

class Orden_compra extends Model
{
    
    public $timestamps = false;

    protected $fillable = [
        'proveedor_id',
        'almacen_destino_id',
        'estado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

      public function almacenDestino()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }

    public function detalles()
    {
        return $this->hasMany(orden_compra_detalle::class, 'orden_compra_id');
    }
}
