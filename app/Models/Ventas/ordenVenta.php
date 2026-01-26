<?php

namespace App\Models\Ventas;

use App\Models\Almacenes\Almacen;
use App\Models\Contabilidad\Comprobante;
use App\Models\Ventas\OrdenCotizacionVenta;
use App\Models\Ventas\OrdenCotizacionArchivo;
use App\Models\General\TipoMoneda;
use App\Models\Inventario\Productos\Producto;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenVenta extends Model
{
    protected $table = 'orden_ventas';
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'cliente_id',
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
        return $this->hasMany(OrdenVentaDetalle::class, 'orden_ventas_id');
    }
    ////ORDEN COTIZACION RELACIONADA
    public function ordenesCotizacionVentas()
    {
        return $this->belongsToMany(
            OrdenCotizacionVenta::class,
            'orden_venta_orden_cotizaciones',
            'orden_ventas_id',
            'orden_cotizaciones_ventas_id'
        );
    }
    ////CLIENTE RELACIONADO
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
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
        return $this->hasMany(OrdenVentaArchivo::class);
    }
    ////ORDEN COTIZACION ARCHIVO RELACIONADO
    public function archivosOrdenCotizacion()
    {
        return OrdenCotizacionVentaArchivo::whereIn(
            'orden_cotizacion_venta_id',
            $this->ordenesCotizacionVentas()->pluck('orden_cotizaciones_ventas.id')
        );
    }
    ////COMPROBANTE CLIENTE RELACIONADO
    public function comprobantes()
    {
        return $this->belongsToMany(
            Comprobante::class,
            'orden_venta_comprobantes',
            'orden_venta_id',
            'comprobante_id'
        )->withTimestamps();
    }


}
