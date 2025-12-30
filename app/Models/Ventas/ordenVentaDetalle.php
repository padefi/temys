<?php

namespace App\Models\Ventas;

use App\Models\General\Impuesto;
use App\Models\Inventario\Productos\Producto;
use App\Models\Ventas\ordenVentaDetalleImpuesto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenVentaDetalle extends Model
{
    protected $table = 'orden_ventas_detalles';
    use HasFactory;
    public $timestamps = false;


    protected $fillable = [

        'id',
        'orden_ventas_id',
        'orden_cotizaciones_ventas_id',
        'producto_id',
        'descripcion',
        'cantidad',
        'precio_unitario',
        'porcentaje_descuento',
        'importe',
        'entrega_esperada',
        'co_cuenta_id',
        'usuario_creacion',
        'fecha_actualizacion',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'precio_unitario'=>'float',
        'importe'=>'float',
        'co_cuenta_id'=>'integer',
        'entrega_esperada'=>'date',
    ];
    ////ORDEN VENTA RELACIONADA
    public function ordenVenta()
    {
        return $this->belongsTo(OrdenVenta::class, 'orden_ventas_id');
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
            'orden_ventas_detalles_impuestos',   // nombre de la tabla pivot
            'orden_ventas_detalles_id',         // FK al detalle
            'impuesto_id'                        // FK al impuesto
        );
    }

        ////DETALLES DE IMPUESTO RELACIONADOS
    public function detallesImpuesto()
    {
        return $this->hasMany(
            ordenVentaDetalleImpuesto::class,
            'orden_ventas_detalles_id'
        );
    }
}
