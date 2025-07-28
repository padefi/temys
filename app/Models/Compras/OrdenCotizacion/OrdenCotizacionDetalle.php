<?php

namespace App\Models\Compras\OrdenCotizacion;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacionDetalle extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = 'orden_cotizaciones_detalle';

    protected $fillable = [
        'orden_cotizaciones_id',
        'producto_id',
        'descripcion',
        'codigo_barras',
        'referencia',
        'cantidad',
        'precio_unitario',
        'porcentaje_descuento',
        'importe',
        'usuario_id',
    ];

    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'porcentaje_descuento' => 'decimal:2',
        'importe' => 'decimal:2',
    ];




    public function ordenCotizacion()
    {
        return $this->belongsTo(OrdenCotizacion::class, 'orden_cotizaciones_id');
    }

     public function detallesImpuesto()
    {
        return $this->hasMany(OrdenCotizacionDetalleImpuesto::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

}
