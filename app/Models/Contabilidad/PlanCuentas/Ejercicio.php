<?php

namespace App\Models\Contabilidad\PlanCuentas;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    protected $table = 'co_ejercicios';
    
    protected $fillable = [
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
    ];

    public function capitulos()
    {
        return $this->hasMany(Capitulo::class, 'co_ejercicio_id');
    }

    public function subcapitulos()
    {
        return $this->hasMany(Subcapitulo::class, 'co_ejercicio_id');
    }

    public function rubros()
    {
        return $this->hasMany(Rubro::class, 'co_ejercicio_id');
    }

    public function subrubros()
    {
        return $this->hasMany(Subrubro::class, 'co_ejercicio_id');
    }

    public function cuentas()
    {
        return $this->hasMany(Cuenta::class, 'co_ejercicio_id');
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
