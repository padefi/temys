<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Rubro extends Model
{
    protected $table = 'rubros';
    
    protected $fillable = [
        'codigo',
        'descripcion',
        'rubro_padre_id',
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

    public function cuentas()
    {
        return $this->hasMany(Cuenta::class, 'rubro_id');
    }

    public function padre()
    {
        return $this->belongsTo(Rubro::class, 'rubro_padre_id');
    }

    public function hijos()
    {
        return $this->hasMany(Rubro::class, 'rubro_padre_id');
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
