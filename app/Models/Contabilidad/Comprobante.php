<?php

namespace App\Models\Contabilidad;

use App\Models\Compras\OrdenCompra;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\ControlAcceso\User;
use App\Models\General\CondicionVenta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Ventas\OrdenVenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comprobante extends Model
{
    use HasFactory;
    protected $table = 'comprobantes';

    protected $fillable = [
        'tipo',
        'tipo_id',
        'fecha_factura',
        'fecha_vencimiento',
        'condicion_venta_id',
        'punto_venta',
        'numero_factura',
        'moneda_id',
        'tipo_comprobante_id',
        'estado',
        'descripcion',
        'usuario_creacion',
    ];

    protected $casts = [
        'fecha_factura' => 'date',
        'fecha_vencimiento' => 'date',
    ];

    ////DETALLES DE COMPROBANTE PROVEEDOR RELACIONADOS
    public function detalles()
    {
        return $this->hasMany(ComprobanteDetalle::class, 'comprobante_id');
    }

    ////CONDICIÓN DE VENTA RELACIONADA
    public function condicionVenta()
    {
        return $this->belongsTo(CondicionVenta::class, 'condicion_venta_id');
    }

    ////TIPO DE COMPROBANTE RELACIONADO
    public function tipoComprobante()
    {
        return $this->belongsTo(TipoComprobante::class, 'tipo_comprobante_id');
    }

    ////USUARIO RELACIONADO
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    ////ORDENES DE COMPRA RELACIONADAS
    public function ordenesCompra()
    {
        return $this->belongsToMany(
            OrdenCompra::class,
            'orden_compra_comprobantes',
            'comprobante_id',
            'orden_compra_id'
        )->withTimestamps();
    }

    ////ORDENES DE VENTA RELACIONADAS
    public function ordenesVenta()
    {
        return $this->belongsToMany(
            OrdenVenta::class,
            'orden_venta_comprobantes',
            'comprobante_id',
            'orden_venta_id'
        )->withTimestamps();
    }



    ////ARCHIVOS DE COMPROBANTE PROVEEDOR RELACIONADOS
    public function archivos()
    {
        return $this->hasMany(ComprobanteArchivo::class);
    }
    ////PLANES RELACIONADOS
    public function planes()
    {
        return $this->belongsToMany(
            Plan::class,
            'relacion_comprobantes_plan',
            'comprobante_id',   // FK local
            'plan_id'               // FK relacionada
        );
    }

    ////PROVEEDOR RELACIONADO
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'tipo_id');
    }

    ////CLIENTE RELACIONADO
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'tipo_id');
    }

    ////ORDENES DE TESORERIA RELACIONADAS
    public function ordenesTesoreria()
    {
        return $this->belongsToMany(
            OrdenTesoreria::class,
            'relacion_comprobante_orden_tesoreria',
            'comprobante_id',
            'orden_tesoreria_id'
        )
        ->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }

    ////TIPO DE MONEDA RELACIONADO
    public function tipoMoneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }

    //RELACION CON LA PARTIDA DEL ASIENTO Y EL COMPROBANTE
    public function partidas()
    {
        return $this->belongsToMany(
            Partida::class,
            'relacion_comprobante_partida',
            'comprobante_id',
            'partida_id'
        )
        ->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }

    ////IMPUESTOS ASOCIADOS A LA FACTURA ORIGEN
    public function impuestos()
    {
        return $this->hasMany(ComprobanteDetalleImpuesto::class, 'comprobante_id');
    }

    ////////////////RELACIONES DE COMPROBANTE CON COMPROBANTE
    public function aplicacionesComoOrigen()
    {
        return $this->hasMany(
            RelacionComprobanteComprobante::class,
            'comprobante_origen_id'
        );
    }

    public function aplicacionesComoDestino()
    {
        return $this->hasMany(
            RelacionComprobanteComprobante::class,
            'comprobante_destino_id'
        );
    }

    ////COMPROBANTES APLICADOS A ESTE COMPROBANTE
    public function comprobantesAplicados()
    {
        return $this->belongsToMany(
            Comprobante::class,
            'relacion_comprobante_comprobante',
            'comprobante_origen_id',   // anticipoe
            'comprobante_destino_id'  // factura / otro comprobant
        )->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }




}
