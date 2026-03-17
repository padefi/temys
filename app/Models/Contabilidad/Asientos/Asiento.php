<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Asiento extends Model
{
    use HasFactory;
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

    protected $casts = [
        'fecha' => 'date',
        'confirmed_at' => 'datetime',
        'voided_at' => 'datetime',
        'importe' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model)
        {
            $model->model_id_created = Auth::id();
            $model->estado = 'PENDIENTE';
        });

        static::updating(function ($model)
        {
            $model->model_id_updated = Auth::id();
        });
    }

    public function scopePendientes($query)
    {
        return $query->where('estado', 'PENDIENTE');
    }

    public function scopeAnulados($query)
    {
        return $query->where('estado', 'ANULADO');
    }

    public function isEditable(): bool
    {
        return $this->estado === 'PENDIENTE';
    }

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

    public function comprobantes()
    {
        return $this->hasManyThrough(
            Comprobante::class,
            Partida::class,
            'co_asiento_id',
            'id',
            'id',
            'id'
        );
    }
}
