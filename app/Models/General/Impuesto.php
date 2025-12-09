<?php

namespace App\Models\General;

use App\Models\Compras\OrdenCompraDetalle;
use App\Models\Compras\OrdenCotizacion\OrdenCotizacionDetalle;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Impuesto extends Model
{
    use HasFactory;



    protected $fillable = [
        'descripcion',
        'porcentaje',
        'co_cuenta_id',
        'habilitado',
    ];

    ////ORDENES DE COTIZACION DETALLE RELACIONADO
    public function cotizacionesOrdenesDetalle()
    {
        return $this->belongsTo(OrdenCotizacionDetalle::class, 'id');
    }
    ////ORDENES DE COMPRA DETALLE RELACIONADO
    public function detalles()
    {
        return $this->belongsToMany(
            OrdenCompraDetalle::class,
            'orden_compras_detalles_impuestos',
            'impuesto_id',
            'orden_compras_detalles_id'
        );
    }

    ////CUENTA RELACIONADA
    public function coCuenta()
    {
        return $this->belongsTo(Cuenta::class, 'co_cuenta_id');
    }
}
