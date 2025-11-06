<?php

namespace App\Models\Compras;

use App\Models\General\Impuesto;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompraDetalle extends Model
{
    protected $table = 'orden_compras_detalles';
    use HasFactory;
    public $timestamps = false;


    protected $fillable = [

        'id',
        'orden_compras_id',
        'orden_cotizaciones_id',
        'producto_id',
        'descripcion',
        'cantidad',
        'precio_unitario',
        'porcentaje_descuento',
        'importe',
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
    ];
    ////ORDEN COMPRA RELACIONADA
    public function ordenCompra()
    {
        return $this->belongsTo(OrdenCompra::class, 'orden_compras_id');
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
            'orden_compras_detalles_impuestos',   // nombre de la tabla pivot
            'orden_compras_detalles_id',         // FK al detalle
            'impuesto_id'                        // FK al impuesto
        );
    }
}
