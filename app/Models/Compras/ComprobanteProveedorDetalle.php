<?php

namespace App\Models\Compras;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\ControlAcceso\User;
use App\Models\General\Impuesto;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComprobanteProveedorDetalle extends Model
{
    use HasFactory;

    protected $table = 'comprobantes_proveedores_detalles';
    protected $fillable = [
        'comprobante_proveedor_id',
        'producto_id',
        'descripcion',
        'modelo',
        'unidad_medida_id',
        'cantidad',
        'precio_unitario',
        'porcentaje_descuento',
        'co_cuenta_id',
        'importe',
        'usuario_creacion',
        'usuario_actualizacion',
    ];
    ////COMPROBANTE PROVEEDOR RELACIONADO
    public function comprobante() {
        return $this->belongsTo(ComprobanteProveedor::class, 'comprobante_proveedor_id');
    }
    ////IMPUESTOS RELACIONADOS
    public function impuestos() {
        return $this->belongsToMany(
            Impuesto::class,
            'comprobantes_proveedores_detalles_impuestos',
            'detalle_id',
            'impuesto_id'
        );
    }
    ////PRODUCTO RELACIONADO
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
    ////USUARIO CREADOR RELACIONADO
    public function creador() {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
    ////USUARIO ACTUALIZADOR RELACIONADO
    public function actualizador() {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    }
    ////CUENTA CONTABLE RELACIONADA
    public function cuentaContable() {
        return $this->belongsTo(Cuenta::class, 'co_cuenta_id');
    }
}
