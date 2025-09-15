<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;

class SaldoCuenta extends Model
{
    protected $table = 'co_saldo_cuentas';
    
    public $timestamps = false;

    protected $fillable = [
        'co_cuenta_id',
        'co_ejercicio_id',
        'debe',
        'haber',
        'saldo',
    ];

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'co_ejercicio_id');
    }

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class, 'co_cuenta_id');
    }    
}
