<?php

namespace App\Models\Compras;

use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompra extends Model
{
    use HasFactory;

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
        return $this->hasMany(OrdenCompraDetalle::class, 'orden_compra_id');
    }
    public function ordenesCotizacion()
    {
        return $this->belongsToMany(
            OrdenCotizacion::class,
            'orden_compra_orden_cotizaciones',
            'orden_compra_id',
            'orden_cotizacion_id'
        );
    }
}
