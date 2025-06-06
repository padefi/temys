<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionClienteCondicion extends Model
{
    use HasFactory;

    protected $table = 'relacion_cliente_condicion';

    protected $fillable = [
        'id_iva',
        'id_cliente'
    ];

    // Relación con CondicionIva
    public function condicionIva()
    {
        return $this->belongsTo(CondicionIva::class, 'id_iva');
    }

    // Relación con Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}
