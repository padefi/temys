<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionClienteProveedor extends Model
{
    use HasFactory;

    protected $table = 'relacion_cliente_proveedor';

    public $timestamps = false;

    protected $fillable = [
        'id_cliente',
        'id_proveedor',
        'fecha_creacion',
        'usuario_creacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    //Relación con Cliente
    public function cliente()
    {
        return $this->belongsTo(\App\Models\Padron\Cliente\Cliente::class, 'id_cliente');
    }

    //Relación con Proveedor
    public function proveedor()
    {
        return $this->belongsTo(\App\Models\Padron\Proveedor\Proveedor::class, 'id_proveedor');
    }
}
