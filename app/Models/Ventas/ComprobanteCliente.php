<?php

namespace App\Models\Ventas;

use App\Models\Compras\PlanPago;
use App\Models\Contabilidad\Asientos\Partida;
use App\Models\ControlAcceso\User;
use App\Models\General\CondicionVenta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteCliente extends Model
{
   use HasFactory;
    protected $table = 'comprobantes_clientes';

    protected $fillable = [
        'cliente_id',
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
        return $this->hasMany(ComprobanteClienteDetalle::class, 'comprobante_cliente_id');
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
            OrdenVenta::class,
            'orden_venta_comprobante',
            'comprobante_cliente_id',
            'orden_venta_id'
        )->withTimestamps();
    }
    ////ARCHIVOS DE COMPROBANTE CLIENTE RELACIONADOS
    public function archivos()
    {
        return $this->hasMany(ComprobanteClienteArchivo::class);
    }
    ////PLANES DE PAGO RELACIONADOS
    public function planesPago()
    {
        return $this->belongsToMany(
            PlanPago::class,
            'relacion_comprobantes_clientes_plan_pagos',
            'comprobante_cliente_id',   // FK local
            'plan_pagos_id'               // FK relacionada
        );
    }

    ////CLIENTE RELACIONADO
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
    ////ORDENES DE PAGO RELACIONADAS
    public function ordenesPago()
    {
        return $this->belongsToMany(
            OrdenVenta::class,
            'relacion_comprobante_orden_venta_clientes',
            'comprobante_cliente_id',
            'orden_venta_id'
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
        return $this->hasMany(ComprobanteClienteDetalleImpuesto::class, 'comprobante_cliente_id');
    }

    ////////////////RELACIONES DE COMPROBANTE CON COMPROBANTE
    /*public function aplicacionesComoOrigen()
    {
        return $this->hasMany(
            RelacionComprobanteComprobanteCliente::class,
            'comprobante_origen_id'
        );
    }

    public function aplicacionesComoDestino()
    {
        return $this->hasMany(
            RelacionComprobanteComprobanteCliente::class,
            'comprobante_destino_id'
        );
    }

    ////COMPROBANTES APLICADOS A ESTE COMPROBANTE
    public function comprobantesAplicados()
    {
        return $this->belongsToMany(
            ComprobanteCliente::class,
            'relacion_comprobante_comprobante_clientes',
            'comprobante_origen_id',   // anticipoe
            'comprobante_destino_id'  // factura / otro comprobant
        )->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }*/



}
