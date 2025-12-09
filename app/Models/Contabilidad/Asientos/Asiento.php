<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Compras\ComprobanteProveedor;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Model;

class Asiento extends Model
{
    protected $table = 'co_asientos';

    protected $fillable = [
        'numero',
        'co_ejercicio_id',
        'fecha',
        'concepto',
        'importe',
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

    public function ejercicio()
    {
        return $this->belongsTo(Ejercicio::class, 'co_ejercicio_id');
    }

    public function partidas()
    {
        return $this->hasMany(Partida::class, 'co_asiento_id');
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

    public function comprobantesProveedores()
    {
        return $this->hasManyThrough(
            ComprobanteProveedor::class,
            Partida::class,
            'co_asiento_id',   // FK en partidas
            'id',              // FK en comprobantes
            'id',              // PK en asiento
            'id'               // PK en partidas
        );
    }
}
