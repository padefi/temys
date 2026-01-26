<?php

namespace App\Models\Contabilidad\Asientos;

use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partida extends Model
{
    use HasFactory;
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

    //RELACION CON LOS COMPROBANTES DE PROVEEDOR
    public function comprobantes()
    {
        return $this->belongsToMany(
            Comprobante::class,
            'relacion_comprobante_partida',
            'partida_id',
            'comprobante_id'
        )
        ->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }
}
