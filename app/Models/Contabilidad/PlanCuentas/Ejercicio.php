<?php

namespace App\Models\Contabilidad\PlanCuentas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Ejercicio extends Model
{
    protected $table = 'ejercicios';
    
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

    public function rubros()
    {
        return $this->hasMany(Rubro::class, 'ejercicio_id');
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
