<?php
namespace App\Models\Compras;

use Illuminate\Database\Eloquent\Model;

class OrdenCompraArchivo extends Model
{
    protected $table = 'orden_compras_archivos';
    protected $fillable = ['orden_compra_id', 'nombre', 'path', 'mime', 'size'];

    public function ordenCompra()
    {
        return $this->belongsTo(OrdenCompra::class);
    }
}
