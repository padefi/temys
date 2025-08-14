<?php

namespace App\Models\Inventario;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class InventarioSolicitudDetalle extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'solicitud_id',
        'producto_id',
        'cantidad',
        'cantidad_aprobada'
    ];

    public function producto()
{
    return $this->belongsTo(Producto::class, 'producto_id');
}

    public function solicitud()
    {
        return $this->belongsTo(InventarioSolicitarStock::class, 'solicitud_id');
    }
}
