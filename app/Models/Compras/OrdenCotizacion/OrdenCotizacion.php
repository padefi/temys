<?php

namespace App\Models\Compras\OrdenCotizacion;

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

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function detalles()
    {
        return $this->hasMany(OrdenCotizacionDetalle::class, 'orden_cotizaciones_id');
    }

    public function tipoMoneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function actualizador()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    }

    /////SOLICITUD DE COMPRA RELACIONADA
    public function solicitudCompra()
    {
        return $this->belongsToMany(
            SolicitudCompra::class,
            'solicitud_compra_orden_cotizaciones',
            'orden_cotizacion_id',
            'solicitud_compra_id'
        );
    }

    public function ordenesCompra()
    {
        return $this->belongsToMany(
            OrdenCompra::class,
            'orden_compra_orden_cotizaciones',
            'orden_cotizacion_id',
            'orden_compra_id'
        );
    }
}
