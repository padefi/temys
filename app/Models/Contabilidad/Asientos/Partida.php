<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Contabilidad\PlanCuentas\Subcuenta;
use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = 'partidas';

    public $timestamps = false;

    protected $fillable = [
        'asiento_id',
        'subcuenta_id',
        'concepto',
        'debe',
        'haber',
    ];

    public function asiento()
    {
        return $this->belongsTo(Asiento::class, 'asiento_id');
    }

    public function subcuenta()
    {
        return $this->belongsTo(Subcuenta::class, 'subcuenta_id');
    }
}
