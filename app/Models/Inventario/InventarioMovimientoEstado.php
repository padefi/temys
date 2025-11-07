<?php

namespace App\Models\Inventario;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class InventarioMovimientoEstado extends Model
{
    protected $table = 'inventario_movimiento_estados';

    protected $fillable = [
        'transito_id',
        'estado',
        'usuario_id',
        'fecha',
        'observacion',
    ];

    public $timestamps = false;

    public function movimientoTransito()
    {
        return $this->hasMany(InventarioStockTransito::class, 'transito_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
