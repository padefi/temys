<?php

namespace App\Models\Compras\OrdenCotizacion;

use App\Models\Almacenes\Almacen;
use App\Models\Compras\OrdenCompra;
use App\Models\Compras\SolicitudCompra;
use App\Models\ControlAcceso\User;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCotizacion extends Model
{
    use HasFactory;

    protected $table = 'orden_cotizaciones';

    protected $fillable = [
        'proveedor_id',
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

    ////PROVEEDOR RELACIONADO
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }
    ////DETALLES DE LA ORDEN DE COTIZACIÓN
    public function detalles()
    {
        return $this->hasMany(OrdenCotizacionDetalle::class, 'orden_cotizaciones_id');
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
            SolicitudCompra::class,
            'solicitud_compra_orden_cotizaciones',
            'orden_cotizaciones_id',
            'solicitud_compra_id'
        );
    }
    ////ORDENES DE COMPRA RELACIONADAS
    public function ordenesCompra()
    {
        return $this->belongsToMany(
            OrdenCompra::class,
            'orden_compra_orden_cotizaciones',
            'orden_cotizaciones_id',
            'orden_compras_id'
        );
    }
    ////ARCHIVOS ADJUNTOS A LA ORDEN DE COTIZACIÓN
    public function archivos()
    {
        return $this->hasMany(OrdenCotizacionArchivo::class, 'orden_cotizacion_id');
    }
}
