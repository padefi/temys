<?php

namespace App\Models\Compras;

use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacion;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionArchivo;
use App\Models\General\TipoMoneda;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompra extends Model
{
    protected $table = 'orden_compras';
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'proveedor_id',
        'moneda_id',
        'cotizacion_moneda',
        'almacen_destino_id',
        'entrega_esperada',
        'observaciones',
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
    ////ALMACEN DESTINO RELACIONADO
    public function almacenDestino()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }
    ////ORDEN COMPRA DETALLE RELACIONADO
    public function detalles()
    {
        return $this->hasMany(OrdenCompraDetalle::class, 'orden_compras_id');
    }
    ////ORDEN COTIZACION RELACIONADA
    public function ordenesCotizacion()
    {
        return $this->belongsToMany(
            OrdenCotizacion::class,
            'orden_compra_orden_cotizaciones',
            'orden_compras_id',
            'orden_cotizaciones_id'
        );
    }
    ////PROVEEDOR RELACIONADO
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }
    ////PRODUCTO RELACIONADO
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    // Relación con el almacen que creó la orden
    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }
    ////TIPO MONEDA RELACIONADA
    public function tipoMoneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }
    ////ORDEN COMPRA ARCHIVO RELACIONADO
    public function archivos()
    {
        return $this->hasMany(OrdenCompraArchivo::class);
    }
    ////ORDEN COTIZACION ARCHIVO RELACIONADO
    public function archivosOrdenCotizacion()
    {
        return OrdenCotizacionArchivo::whereIn(
            'orden_cotizacion_id',
            $this->ordenesCotizacion()->pluck('orden_cotizaciones.id')
        );
    }
    ////COMPROBANTE PROVEEDOR RELACIONADO
    public function comprobantesProveedores()
    {
        return $this->belongsToMany(
            ComprobanteProveedor::class,
            'orden_compra_comprobante',
            'orden_compra_id',
            'comprobante_id'
        )->withTimestamps();
    }


}
