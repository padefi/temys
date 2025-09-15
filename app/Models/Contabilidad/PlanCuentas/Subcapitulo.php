<?php

namespace App\Models\Contabilidad\PlanCuentas;

use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Subcapitulo extends Model
{
    protected $table = 'co_subcapitulos';

    protected $fillable = [
        'codigo',
        'descripcion',
        'co_capitulo_id',
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

    public function capitulo()
    {
        return $this->belongsTo(Capitulo::class, 'co_capitulo_id');
    }

    public function rubros()
    {
        return $this->hasMany(Rubro::class, 'co_subcapitulo_id');
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
