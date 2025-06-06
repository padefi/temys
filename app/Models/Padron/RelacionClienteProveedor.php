<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionClienteProveedor extends Model
{
    use HasFactory;

    protected $table = 'relacion_cliente_proveedor';

    protected $fillable = [
        'id_cliente',
        'id_proveedor'
    ];

    // Relación con Cliente
    public function cliente()
    {
        return $this->belongsTo(\App\Models\Padron\Cliente\Cliente::class, 'id_cliente');
    }

    // Relación con Proveedor
    public function proveedor()
    {
        return $this->belongsTo(\App\Models\Padron\Proveedor\Proveedor::class, 'id_proveedor');
    }
}
