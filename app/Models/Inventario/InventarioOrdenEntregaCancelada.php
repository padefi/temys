<?php

namespace App\Models\Inventario;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\InventarioOrdenEntrega;
use Illuminate\Database\Eloquent\Model;

class InventarioOrdenEntregaCancelada extends Model
{
    protected $table='inventario_orden_entrega_canceladas';
    
    public $timestamps = false;
   
    protected $fillable = [ 
        'orden_entrega_id',
        'motivo',
        'fecha',
        'usuario',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function ordenEntrega()
    {
        return $this->belongsTo(InventarioOrdenEntrega::class, 'orden_entrega_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario');
    }
}
