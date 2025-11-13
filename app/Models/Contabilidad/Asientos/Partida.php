<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Partida extends Model
{
    protected $table = 'co_partidas';

    public $timestamps = false;

    protected $fillable = [
        'co_asiento_id',
        'co_cuenta_id',
        'concepto',
        'debe',
        'haber',
    ];

    public function scopeByAsientoId(Builder $query, int|string $asientoId): Builder
    {
        return $query->where('co_asiento_id', $asientoId);
    }

    public static function forAsiento(int|string $asientoId)
    {
        return static::query()->where('co_asiento_id', $asientoId);
    }

    public function asiento()
    {
        return $this->belongsTo(Asiento::class, 'co_asiento_id');
    }

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class, 'co_cuenta_id');
    }
}
