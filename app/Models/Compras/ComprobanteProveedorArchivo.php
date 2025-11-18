<?php
namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Model;

class ComprobanteProveedorArchivo extends Model
{
    protected $table = 'comprobante_proveedor_archivos';
    protected $fillable = ['comprobante_proveedor_id', 'nombre', 'path', 'mime', 'size'];

    ////COMPROBANTE PROVEEDOR RELACIONADO
    public function comprobanteProveedor()
    {
        return $this->belongsTo(ComprobanteProveedor::class);
    }
}
