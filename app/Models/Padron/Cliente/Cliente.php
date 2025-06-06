<?php

namespace App\Models\Padron\Cliente;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'id_padron',
        'apellido',
        'nombre'
    ];

    // Relación con el padrón
    public function padron()
    {
        return $this->belongsTo(\App\Models\Padron\Padron::class, 'id_padron');
    }

    // relación al modelo Cliente
    public function proveedores()
    {
        return $this->belongsToMany(\App\Models\Padron\Proveedor\Proveedor::class, 'relacion_cliente_proveedor', 'id_cliente', 'id_proveedor');
    }

    // relación al modelo Cliente
    public function condicionesIva()
    {
        return $this->belongsToMany(\App\Models\Padron\CondicionIva::class, 'relacion_cliente_condicion', 'id_cliente', 'id_iva')
                    ->withTimestamps();
    }
}
