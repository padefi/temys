<?php

namespace App\Models\Compras\OrdenCotizacion;

use App\Models\General\Impuesto;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacionDetalle extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = 'orden_cotizaciones_detalles';

    protected $fillable = [
        'orden_cotizaciones_id',
        'producto_id',
        'descripcion',
        'codigo_barras',
        'entrega_esperada',
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
        'entrega_esperada' => 'date',
        'impuestos_seleccionados' => 'array',
    ];


    ////ORDEN DE COTIZACIÓN RELACIONADA
    public function ordenCotizacion()
    {
        return $this->belongsTo(OrdenCotizacion::class, 'orden_cotizaciones_id');
    }
    ////DETALLES DE IMPUESTO RELACIONADOS
    public function detallesImpuesto()
    {
        return $this->hasMany(
            OrdenCotizacionDetalleImpuesto::class,
            'orden_cotizaciones_detalles_id'
        );
    }

    ////PRODUCTO RELACIONADO
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    ////IMPUESTOS RELACIONADOS
    public function impuestos()
    {
        return $this->belongsToMany(
            Impuesto::class,
            'orden_cotizaciones_detalles_impuestos',
            'orden_cotizaciones_detalles_id',
            'impuesto_id'
        );
    }

}
