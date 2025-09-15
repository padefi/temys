<?php
namespace App\Models\Compras\OrdenCotizacion;

use App\Models\Compras\OrdenCompra;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacionArchivo extends Model
{
    protected $table = 'orden_cotizaciones_archivos';
    protected $fillable = ['orden_cotizacion_id', 'nombre', 'path', 'mime', 'size'];

    public function ordenesCotizacion()
    {
        return $this->belongsToMany(
            OrdenCotizacion::class,
            'orden_compra_orden_cotizaciones',
            'orden_compras_id',
            'orden_cotizaciones_id'
        )->select('orden_cotizaciones.id'); // 👈 alias limpio
    }


}
