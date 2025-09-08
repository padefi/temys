<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;

class SaldoSubcuenta extends Model
{
    protected $table = 'saldo_subcuentas';
    
    public $timestamps = false;

    protected $fillable = [
        'subcuenta_id',
        'ejercicio_id',
        'debe',
        'haber',
        'saldo',
    ];

    public function subcuenta()
    {
        return $this->belongsTo(Subcuenta::class, 'subcuenta_id');
    }

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'ejercicio_id');
    }
}
