<?php

namespace App\Models\General;

use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    use HasFactory;

    protected $table = 'metodo_pagos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'habilitado',
        'co_cuenta_id',
    ];
    ////ORDENES DE PAGO RELACIONADAS
    public function ordenesPago()
    {
        return $this->hasMany(OrdenPago::class, 'metodo_pago_id');
    }
    public function cuentaContable()
    {
        return $this->hasOne(Cuenta::class, 'id', 'co_cuenta_id');
    }
}
