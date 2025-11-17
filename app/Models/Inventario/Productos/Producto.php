<?php

namespace App\Models\Inventario\Productos;

use App\Models\Compras\OrdenCompraDetalle;
use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;
use App\Models\Inventario\InventarioAjusteDetalle;
use App\Models\Inventario\InventarioTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
    protected $table = 'productos';
    public $timestamps = false;


    protected $fillable = [

        'nombre',
        'descripcion',
        'modelo_id',
        'subcategoria_id',
        'peso',
        'alto',
        'ancho',
        'volumen',
        'profundidad',
        'cod_barras',
        'es_inventario',
        'es_patrimonio',
        'referencia',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
        'peso' => 'float',
        'alto' => 'float',
        'ancho' => 'float',
        'volumen' => 'float',
        'profundidad' => 'float',
    ];


    public function modelo()
    {
        return $this->belongsTo(ProductoModelo::class, 'modelo_id', 'id');
    }

    public function subCategoria()
    {
        return $this->belongsTo(ProductoSubcategoria::class, 'subcategoria_id', 'id');
    }

    public function caracteristicas()
    {
        return $this->belongsToMany(
            ProductoCaracteristica::class,
            'relacion_producto_caracteristica',
            'caracteristica_id', // FK de este modelo (Caracteristica)
            'producto_id'        // FK del otro modelo (Producto)
        );
    }


    public function movimientosStock()
    {
        return $this->hasMany(InventarioMovimientoStock::class, 'producto_id');
    }

    public function ajustesInventarioDetalles()
    {
        return $this->hasMany(InventarioAjusteDetalle::class, 'producto_id');
    }

    public function cotizacionesOrdenesDetalle()
    {
        return $this->belongsTo(OrdenCotizacionDetalle::class, 'id');
    }

    public function ordenCompraDetalle()
    {
        return $this->belongsTo(OrdenCompraDetalle::class, 'id');
    }

   
}
