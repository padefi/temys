<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Cuenta extends Model
{
    protected $table = 'cuentas';
    
    protected $fillable = [
        'codigo',
        'descripcion',
        'rubro_id',
        'ejercicio_id',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'ejercicio_id');
    }

    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'rubro_id');
    }

    public function subcuentas()
    {
        return $this->hasMany(Subcuenta::class, 'cuenta_id');
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
