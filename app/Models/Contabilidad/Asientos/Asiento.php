<?php

namespace App\Models\Contabilidad\Asientos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class Asiento extends Model
{
    protected $table = 'asientos';

    protected $fillable = [
        'numero',
        'ejercicio_id',
        'fecha',
        'concepto',
        'estado',
        'model_id_created',
        'created_at',
        'model_id_updated',
        'updated_at',
        'model_id_confirmed',
        'confirmed_at',
        'model_id_voided',
        'voided_at',
    ];

    public function partidas()
    {
        return $this->hasMany(Partida::class, 'asiento_id');
    }

    public function userCreated()
    {
        return $this->belongsTo(User::class, 'model_id_created');
    }

    public function userUpdated()
    {
        return $this->belongsTo(User::class, 'model_id_updated');
    }

    public function userConfirmed()
    {
        return $this->belongsTo(User::class, 'model_id_confirmed');
    }

    public function userVoided()
    {
        return $this->belongsTo(User::class, 'model_id_voided');
    }
}
