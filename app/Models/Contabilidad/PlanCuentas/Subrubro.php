<?php

namespace App\Models\Contabilidad\PlanCuentas;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Subrubro extends Model
{
    protected $table = 'co_subrubros';

    protected $fillable = [
        'codigo',
        'descripcion',
        'co_rubro_id',
        'co_ejercicio_id',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'co_ejercicio_id');
    }

    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'co_rubro_id');
    }

    public function cuentas()
    {
        return $this->hasMany(Cuenta::class, 'co_subrubro_id');
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
