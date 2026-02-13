<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\CuentaBancaria;
use App\Models\Padron\PadronDatoBancario;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenTesoreriaPagoTransferencia extends Model
{
    use HasFactory;

    protected $table = 'orden_tesoreria_pago_transferencias';

    protected $fillable = [
        'orden_tesoreria_id',
        'cuenta_bancaria_origen_id',
        'tipo',
        'cbu_id',
        'numero_operacion',
        'usuario_creacion',
    ];

    // ================= RELACIONES =================

    public function ordenTesoreria()
    {
        return $this->belongsTo(OrdenTesoreria::class, 'orden_tesoreria_id');
    }

    public function cuentaBancariaOrigen()
    {
        return $this->belongsTo(CuentaBancaria::class, 'cuenta_bancaria_origen_id');
    }

    public function cbuDestino()
    {
        return $this->belongsTo(PadronDatoBancario::class, 'cbu_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
}
