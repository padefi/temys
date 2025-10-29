<?php

namespace App\Models\Inventario;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class InventarioRecepcionCancelada extends Model
{
     protected $table='inventario_orden_entrega_canceladas';
    
    public $timestamps = false;
   
    protected $fillable = [ 
        'recepcion_id',
        'motivo',
        'fecha',
        'usuario',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function ordenEntrega()
    {
        return $this->belongsTo(InventarioRecepcionProducto::class, 'recepcion_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario');
    }
}
