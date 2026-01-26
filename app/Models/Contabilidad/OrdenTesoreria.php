<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\Comprobante;
use App\Models\Contabilidad\Plan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\General\TipoMoneda;
use App\Models\ControlAcceso\User;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoTesoreria;
use App\Models\General\Tarjeta;

class OrdenTesoreria extends Model
{
    use HasFactory;
    protected $table = 'orden_tesoreria';


    protected $fillable = [
        'tipo',
        'plan_id',
        'moneda_id',
        'metodo_id',
        'importe',
        'fecha',
        'estado',
        'usuario_creacion',
        'usuario_aprobacion'
    ];
    ////PLAN PAGO RELACIONADO
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
    ////MONEDA RELACIONADA
    public function moneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda_id');
    }
    ////METODO PAGO RELACIONADO
    public function metodoPago()
    {
        return $this->belongsTo(MetodoTesoreria::class, 'metodo_id');
    }
    ////METODO COBRO RELACIONADO
    public function metodoCobro()
    {
        return $this->belongsTo(MetodoTesoreria::class, 'metodo_id');
    }
    ////USUARIO CREADOR RELACIONADO
    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
    ////USUARIO APROBADOR RELACIONADO
    public function aprobador()
    {
        return $this->belongsTo(User::class, 'usuario_aprobacion');
    }
    ////COMPROBANTES RELACIONADOS
    public function comprobantes()
    {
        return $this->belongsToMany(
            Comprobante::class,
            'relacion_comprobante_orden_tesoreria',
            'orden_tesoreria_id',
            'comprobante_id'
        )
        ->withPivot(['importe_aplicado', 'fecha_aplicacion'])
        ->withTimestamps();
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

    public function tarjetaOrigen()
    {
        return $this->belongsTo(Tarjeta::class, 'tarjeta_origen_id');
    }

    //// ================= COBROS =================

    public function cobroEfectivo()
    {
        return $this->hasOne(
            OrdenTesoreriaCobroEfectivo::class,
            'orden_tesoreria_id'
        );
    }

    public function cobroTransferencia()
    {
        return $this->hasOne(
            OrdenTesoreriaCobroTransferencia::class,
            'orden_tesoreria_id'
        );
    }

    public function cobroCheque()
    {
        return $this->hasOne(
            OrdenTesoreriaCobroCheque::class,
            'orden_tesoreria_id'
        );
    }

    public function cobroTarjeta()
    {
        return $this->hasOne(
            OrdenTesoreriaCobroTarjeta::class,
            'orden_tesoreria_id'
        );
    }

    //// ================= PAGOS =================

    public function pagoEfectivo()
    {
        return $this->hasOne(
            OrdenTesoreriaPagoEfectivo::class,
            'orden_tesoreria_id'
        );
    }

    public function pagoTransferencia()
    {
        return $this->hasOne(
            OrdenTesoreriaPagoTransferencia::class,
            'orden_tesoreria_id'
        );
    }

    public function pagoCheque()
    {
        return $this->hasOne(
            OrdenTesoreriaPagoCheque::class,
            'orden_tesoreria_id'
        );
    }

    public function pagoTarjeta()
    {
        return $this->hasOne(
            OrdenTesoreriaPagoTarjeta::class,
            'orden_tesoreria_id'
        );
    }


}
