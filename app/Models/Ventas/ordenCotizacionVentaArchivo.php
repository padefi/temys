<?php

namespace App\Models\Ventas;

use App\Models\Ventas\ordenCotizacionVenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ordenCotizacionVentaArchivo extends Model
{
    protected $table = 'orden_cotizacion_venta_archivos';
    protected $fillable = ['orden_cotizacion_ventas_id', 'nombre', 'path', 'mime', 'size'];

    ////ORDENES DE COTIZACIÓN RELACIONADAS
    public function ordenesCotizacion()
    {
        return $this->belongsToMany(
            ordenCotizacionVenta::class,
            'orden_cotizacion_venta_archivos_orden_cotizacion_ventas',
            'orden_cotizacion_ventas_id',
            'orden_cotizaciones_ventas_id'
        )->select('orden_cotizacion_ventas.id'); // 👈 alias limpio
    }
}
