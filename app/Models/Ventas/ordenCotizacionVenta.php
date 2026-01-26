<?php

namespace App\Models\Ventas;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\General\TipoMoneda;
use App\Models\Ventas\ordenCotizacionVentaArchivo;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ordenCotizacionVenta extends Model
{
    /** @use HasFactory<\Database\Factories\OrdenCotizacionVentaFactory> */
    use HasFactory;

    protected $table = 'orden_cotizaciones_ventas';

    protected $fillable = [
        'cliente_id',
        'moneda_id',
        'almacen_destino_id',
        'cotizar_antes_de',
        'entrega_esperada',
        'entregar_a',
        'observaciones',
        'estado',
        'usuario_id',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'cotizar_antes_de' => 'date',
        'entregar_esperada' => 'date',

    ];

    ////CLIENTE RELACIONADO
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
    ////DETALLES DE LA ORDEN DE COTIZACIÓN
    public function detalles()
    {
        return $this->hasMany(OrdenCotizacionVentaDetalle::class, 'orden_cotizaciones_ventas_id');
    }
    ////TIPO DE MONEDA RELACIONADO
    public function tipoMoneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }
    ////ALMACÉN DESTINO RELACIONADO
    public function almacenDestino()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }
    ////USUARIO QUE CREÓ LA ORDEN DE COTIZACIÓN
    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
    ////USUARIO QUE ÚLTIMAMENTE ACTUALIZÓ LA ORDEN DE COTIZACIÓN
    public function actualizador()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    }
    // Relación con el almacen que creó la orden
    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }
    /////SOLICITUD DE COMPRA RELACIONADA
    public function solicitudCompra()
    {
        return $this->belongsToMany(
            SolicitudVenta::class,
            'solicitud_venta_orden_cotizaciones',
            'orden_cotizaciones_ventas_id',
            'solicitud_venta_id'
        );
    }
    ////ORDENES DE VENTA RELACIONADAS
    public function ordenesVenta()
    {
        return $this->belongsToMany(
            OrdenVenta::class,
            'orden_venta_orden_cotizaciones',
            'orden_cotizaciones_ventas_id',
            'orden_ventas_id'
        );
    }
    ////ARCHIVOS ADJUNTOS A LA ORDEN DE COTIZACIÓN
    public function archivos()
    {
        return $this->hasMany(ordenCotizacionVentaArchivo::class, 'orden_cotizaciones_ventas_id');
    }
}
