<?php

namespace App\Models\Compras;

use App\Models\Contabilidad\Asientos\Partida;
use App\Models\ControlAcceso\User;
use App\Models\General\CondicionVenta;
use App\Models\General\TipoComprobante;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteProveedor extends Model
{
    use HasFactory;
    protected $table = 'comprobantes_proveedores';

    protected $fillable = [
        'proveedor_id',
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
        return $this->hasMany(ComprobanteProveedorDetalle::class, 'comprobante_proveedor_id');
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
            'orden_compra_comprobante',
            'comprobante_id',
            'orden_compra_id'
        )->withTimestamps();
    }
    ////ARCHIVOS DE COMPROBANTE PROVEEDOR RELACIONADOS
    public function archivos()
    {
        return $this->hasMany(ComprobanteProveedorArchivo::class);
    }
    ////PLANES DE PAGO RELACIONADOS
    public function planesPago()
    {
        return $this->belongsToMany(
            PlanPago::class,
            'relacion_comprobantes_proveedores_plan_pagos',
            'comprobante_proveedor_id',   // FK local
            'plan_pagos_id'               // FK relacionada
        );
    }

    ////PROVEEDOR RELACIONADO
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }
    ////ORDENES DE PAGO RELACIONADAS
    public function ordenesPago()
    {
        return $this->belongsToMany(
            OrdenPago::class,
            'relacion_comprobante_orden_pago_proveedores',
            'comprobante_id',
            'orden_pago_id'
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
        return $this->hasMany(ComprobanteProveedorDetalleImpuesto::class, 'comprobante_proveedor_id');
    }



}
