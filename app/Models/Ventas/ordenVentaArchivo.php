<?php

namespace App\Models\Ventas;

use App\Models\Ventas\OrdenVenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ordenVentaArchivo extends Model
{
    protected $table = 'orden_venta_archivos';
    protected $fillable = ['orden_venta_id', 'nombre', 'path', 'mime', 'size'];
    ////ORDEN VENTA RELACIONADA
    public function ordenVenta()
    {
        return $this->belongsTo(OrdenVenta::class);
    }
}
