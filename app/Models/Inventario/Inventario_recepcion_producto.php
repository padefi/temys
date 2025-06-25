<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Inventario_recepcion_producto extends Model
{

    public $timestamps = false;
    
    protected $fillable = [
    
        'origen_id',
        'destino_id',
        'tipo_movimiento',
        'movimiento_id',
        'fecha_recepcion',
        'estado',
        'fecha_creacion',
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
        return $this->belongsTo(Almacen::class, 'id_remitente');
    }

    public function destino()
    {
        return $this->belongsTo(Almacen::class, 'id_destino');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function detalles()
    {
        return $this->hasMany(Inventario_recepcion_producto_detalle::class, 'recepcion_id');
    }
}
