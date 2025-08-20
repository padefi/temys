<?php

namespace App\Models\Compras;

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
    ];

        public function ordenCompra()
    {
        return $this->belongsTo(OrdenCompra::class, 'orden_compras_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
