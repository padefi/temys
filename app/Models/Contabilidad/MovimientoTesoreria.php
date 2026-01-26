<?php

namespace App\Models\Contabilidad;

use App\Models\Compras\OrdenPago;
use App\Models\ControlAcceso\User;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use App\Models\General\MetodoPago;
use App\Models\General\MetodoTesoreria;
use App\Models\General\TipoMoneda;
use App\Models\Padron\Cliente\Cliente;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoTesoreria extends Model
{
    use HasFactory;

    protected $table = 'movimientos_tesoreria';

    protected $fillable = [
        'fecha_movimiento',
        'fecha_aplicacion',
        'tipo_movimiento',
        'monto',
        'metodo_id',
        'tipo_moneda_id',
        'banco_id',
        'cuenta_bancaria_id',
        'orden_pago_id',
        'tipo_id',
        'usuario_id',
        'descripcion',
        'referencia_bancaria',
        'conciliado',
        'fecha_conciliacion',
        'tipo_moneda_id',
        'usuario_conciliado_id',
    ];

    // Relaciones
    ////METODO DE PAGO RELACIONADO
    public function metodoPago() { return $this->belongsTo(MetodoTesoreria::class); }
    ////BANCO RELACIONADO
    public function banco() { return $this->belongsTo(Banco::class); }
    ////CUENTA BANCARIA RELACIONADA
    public function cuentaBancaria() { return $this->belongsTo(CuentaBancaria::class); }
    ////ORDEN DE PAGO RELACIONADA
    public function OrdenTesoreria() { return $this->belongsTo(OrdenTesoreria::class); }
    ////PROVEEDOR RELACIONADO
    public function proveedor() { return $this->belongsTo(Proveedor::class); }
    ////CLIENTE RELACIONADO
    public function cliente() { return $this->belongsTo(Cliente::class); }
    ////TIPO DE MONEDA RELACIONADO
    public function tipoMoneda() { return $this->belongsTo(TipoMoneda::class, 'tipo_moneda_id'); }
    ////USUARIO RELACIONADO
    public function usuario() { return $this->belongsTo(User::class, 'usuario_conciliado_id'); }
}
