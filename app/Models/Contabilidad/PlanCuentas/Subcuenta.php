<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Subcuenta extends Model
{
    protected $table = 'subcuentas';
    
    protected $fillable = [
        'codigo',
        'descripcion',
        'cuenta_id',
        'ejercicio_id',
        'estado',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_id');
    }

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'ejercicio_id');
    }

    public function saldos()
    {
        return $this->hasMany(SaldoSubcuenta::class, 'subcuenta_id');
    }

    public function userCreated()
    {
        return $this->belongsTo(User::class, 'model_id_created');
    }

    public function userUpdated()
    {
        return $this->belongsTo(User::class, 'model_id_updated');
    }
}
