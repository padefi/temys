<?php

namespace App\Models\Ventas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteClienteArchivo extends Model
{
    protected $table = 'comprobante_cliente_archivos';
    protected $fillable = ['comprobante_cliente_id', 'nombre', 'path', 'mime', 'size'];

    ////COMPROBANTE CLIENTE RELACIONADO
    public function comprobanteCliente()
    {
        return $this->belongsTo(ComprobanteCliente::class);
    }
}
