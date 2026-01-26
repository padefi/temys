<?php

namespace App\Models\General;

use App\Models\Contabilidad\OrdenPago;
use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\Contabilidad\PlanCuentas\Cuenta;
use App\Models\Ventas\OrdenCobro;
use App\Models\Ventas\OrdenVenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetodoTesoreria extends Model
{
    use HasFactory;

    protected $table = 'metodo_tesoreria';

    protected $fillable = [
        'tipo',
        'nombre',
        'descripcion',
        'habilitado',
        'co_cuenta_id',
    ];
    ////ORDENES DE TESORERIA RELACIONADAS
    public function ordenesTesoreria()
    {
        return $this->hasMany(OrdenTesoreria::class, 'metodo_id');
    }

    public function cuentaContable()
    {
        return $this->hasOne(Cuenta::class, 'id', 'co_cuenta_id');
    }
}
