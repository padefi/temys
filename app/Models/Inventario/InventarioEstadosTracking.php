<?php

namespace App\Models\Inventario;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class InventarioEstadosTracking extends Model
{
    protected $table = 'inventario_estados_tracking';

    protected $fillable = [
        'seguimiento_id',
        'estado',
        'usuario_id',
        'ubicacion_actual',
        'fecha',
        'observacion',
    ];

    public $timestamps = false;

    public function movimientoTransito()
    {
        return $this->hasMany(InventarioTracking::class, 'seguimiento_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
