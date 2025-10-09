<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = 'partidas';

    public $timestamps = false;

    protected $fillable = [
        'co_asiento_id',
        'co_cuenta_id',
        'concepto',
        'debe',
        'haber',
    ];

    public function asiento()
    {
        return $this->belongsTo(Asiento::class, 'co_asiento_id');
    }

    public function subcuenta()
    {
        return $this->belongsTo(Cuenta::class, 'co_cuenta_id');
    }
}
