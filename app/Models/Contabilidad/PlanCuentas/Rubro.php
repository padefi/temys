<?php

namespace App\Models\Contabilidad\PlanCuentas;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Rubro extends Model
{
    protected $table = 'co_rubros';
    
    protected $fillable = [
        'codigo',
        'descripcion',
        'co_subcapitulo_id',
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

    public function subcapitulo()
    {
        return $this->belongsTo(Subcapitulo::class, 'co_subcapitulo_id');
    }

    public function subrubros()
    {
        return $this->hasMany(Subrubro::class, 'co_rubro_id');
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
