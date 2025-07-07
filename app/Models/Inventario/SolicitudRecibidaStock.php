<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;

class SolicitudRecibidaStock extends Model
{
    protected $table='inventario_solicitar_stocks';
    public $timestamps = false;

    protected $fillable = [
        'producto_id',
        'almacen_solicitante_id',
        'cantidad_solicitada',
        'prioridad',
        'fecha_creacion',
    ];

      public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }


        public function almacenSolicitante()
    {
        return $this->belongsTo(Almacen::class, 'almacen_solicitante_id');
    }
}
