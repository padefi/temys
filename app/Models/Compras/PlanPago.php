<?php

namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\General\TipoTramite;

class PlanPago extends Model
{
    use HasFactory;

    protected $fillable = ['tipo_pago', 'cantidad_cuotas'];
    ////TIPO TRAMITE RELACIONADO
    public function tipoTramites()
    {
        return $this->belongsToMany(TipoTramite::class, 'tipo_tramite_plan_pago');
    }
    ////ORDENES DE PAGO RELACIONADAS
    public function ordenesPago()
    {
        return $this->hasMany(OrdenPago::class);
    }
    ////COMPROBANTES PROVEEDORES RELACIONADOS
    public function comprobantesProveedores()
    {
        return $this->belongsToMany(
            ComprobanteProveedor::class,
            'relacion_comprobantes_proveedores_plan_pagos',
            'plan_pagos_id',              // FK local
            'comprobante_proveedor_id'    // FK relacionada
        );
    }



}
