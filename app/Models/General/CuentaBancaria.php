<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuentaBancaria extends Model
{
    use HasFactory;

    protected $fillable = [
        'banco_id',
        'numero_cuenta',
        'activo',
        'tipo_cuenta',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // Relación con Banco
    public function banco()
    {
        return $this->belongsTo(Banco::class);
    }

    // Scope para cuentas activas
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }
}
