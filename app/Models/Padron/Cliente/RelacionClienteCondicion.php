<?php

namespace App\Models\Padron\Cliente;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionClienteCondicion extends Model
{
    use HasFactory;

    protected $table = 'relacion_cliente_condicion';

    public $timestamps = false;

    protected $fillable = [
        'id_iva',
        'id_cliente',
        'fecha_creacion',
        'usuario_creacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    // Relación con CondicionIva
    public function condicionIva()
    {
        return $this->belongsTo(\App\Models\Padron\CondicionIva::class, 'id_iva');
    }

    // Relación con Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
