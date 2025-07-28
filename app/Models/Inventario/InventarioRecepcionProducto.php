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
        'tipo_movimiento',
        'movimiento_id',
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

     public function remitente()
    {
        return $this->belongsTo(Almacen::class, 'remitente_id');
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
}
