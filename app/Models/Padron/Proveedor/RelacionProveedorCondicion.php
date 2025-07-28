<?php

namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelacionProveedorCondicion extends Model
{
    use HasFactory;

    protected $table = 'relacion_proveedor_condicion';

    protected $fillable = [
        'id_iva',
        'id_proveedor'
    ];

    // Relación con CondicionIva
    public function condicionIva()
    {
        return $this->belongsTo(\App\Models\Padron\CondicionIva::class, 'id_iva');
    }

    // Relación con Proveedor
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }
}
