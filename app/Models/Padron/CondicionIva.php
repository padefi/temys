<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CondicionIva extends Model
{
    use HasFactory;

    protected $table = 'condicion_iva';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    //Relación con clientes (opcional, si necesitas esta relación)
    public function clientes()
    {
        return $this->hasMany(\App\Models\Padron\Cliente\Cliente::class, 'condicion_iva_id');
    }

    //Agrega esta relación al modelo CondicionIva
    public function clientesCondicion()
    {
        return $this->belongsToMany(\App\Models\Padron\Cliente\Cliente::class, 'relacion_cliente_condicion', 'id_iva', 'id_cliente')
                    ->withTimestamps();
    }

    //Agrega esta relación al modelo CondicionIva
    public function proveedoresCondicion()
    {
        return $this->belongsToMany(\App\Models\Padron\Proveedor\Proveedor::class, 'relacion_proveedor_condicion', 'id_iva', 'id_proveedor')
                    ->withTimestamps();
    }
}
