<?php

namespace App\Models\General;

use App\Models\Compras\OrdenPago;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    use HasFactory;

    protected $table = 'metodo_pagos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'habilitado',
    ];
    ////ORDENES DE PAGO RELACIONADAS
    public function ordenesPago()
    {
        return $this->hasMany(OrdenPago::class, 'metodo_pago_id');
    }
}
