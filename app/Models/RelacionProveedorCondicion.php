<?php

namespace App\Models;

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
        return $this->belongsTo(CondicionIva::class, 'id_iva');
    }

    // Relación con Proveedor
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }
}
