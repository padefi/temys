<?php

namespace App\Models\Contabilidad\PlanCuentas;

use App\Models\Compras\ComprobanteProveedorDetalle;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    protected $table = 'co_cuentas';

    protected $fillable = [
        'codigo',
        'descripcion',
        'co_subrubro_id',
        'co_ejercicio_id',
        'estado',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'co_ejercicio_id');
    }

    public function subrubro()
    {
        return $this->belongsTo(Subrubro::class, 'co_subrubro_id');
    }

    public function saldo()
    {
        return $this->hasOne(SaldoCuenta::class, 'co_cuenta_id');
    }

    public function userCreated()
    {
        return $this->belongsTo(User::class, 'model_id_created');
    }

    public function userUpdated()
    {
        return $this->belongsTo(User::class, 'model_id_updated');
    }

    public function comprobantesProveedorDetalle() {
        return $this->belongsTo(ComprobanteProveedorDetalle::class, 'id');
    }
}
