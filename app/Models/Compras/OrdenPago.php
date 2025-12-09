<?php

namespace App\Models\Compras;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\General\TipoMoneda;
use App\Models\ControlAcceso\User;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoPago;
use App\Models\General\Tarjeta;

class OrdenPago extends Model
{
    protected $table = 'orden_pago_proveedores';
    use HasFactory;

    protected $fillable = [
        'plan_pago_id',
        'moneda_id',
        'metodo_pago_id',
        'importe',
        'fecha_pago',
        'banco_origen_id',
        'cuenta_origen_id',
        'tarjeta_origen_id',
        'cbu_pago',
        'estado',
        'usuario_creacion',
        'usuario_pago'
    ];
    ////PLAN PAGO RELACIONADO
    public function planPago()
    {
        return $this->belongsTo(PlanPago::class);
    }
    ////MONEDA RELACIONADA
    public function moneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }
    ////METODO PAGO RELACIONADO
    public function metodoPago()
    {
        return $this->belongsTo(MetodoPago::class, 'metodo_pago_id');
    }
    ////USUARIO CREADOR RELACIONADO
    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
    ////USUARIO PAGADOR RELACIONADO
    public function pagador()
    {
        return $this->belongsTo(User::class, 'usuario_pago');
    }
    ////BANCO ORIGEN RELACIONADO
    public function bancoOrigen()
    {
        return $this->belongsTo(Banco::class, 'banco_origen_id');
    }
    ////CUENTA ORIGEN RELACIONADA
    public function cuentaOrigen()
    {
        return $this->belongsTo(CuentaBancaria::class, 'cuenta_origen_id');
    }
    ////TARJETA ORIGEN RELACIONADA
    public function tarjetaOrigen()
    {
        return $this->belongsTo(Tarjeta::class, 'tarjeta_origen_id');
    }
    ////COMPROBANTES PROVEEDORES RELACIONADOS
    public function comprobantesProveedores()
    {
        return $this->belongsToMany(
            ComprobanteProveedor::class,
            'relacion_comprobante_orden_pago_proveedores',
            'orden_pago_id',
            'comprobante_id'
        )
        ->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
    }






}
