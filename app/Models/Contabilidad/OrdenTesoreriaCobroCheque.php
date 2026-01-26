<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\Banco;
use App\Models\General\CuentaBancaria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenTesoreriaCobroCheque extends Model
{
    use HasFactory;

    protected $table = 'orden_tesoreria_cobro_cheque';

    protected $fillable = [
        'orden_tesoreria_id',
        'banco_emisor_id',
        'banco_destino_id',
        'cuenta_destino_id',
        'fecha_cheque',
        'numero_cheque',
        'numero_operacion',
        'usuario_creacion',
    ];

    // ================= RELACIONES =================

    public function ordenTesoreria()
    {
        return $this->belongsTo(OrdenTesoreria::class, 'orden_tesoreria_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    public function bancoEmisor()
    {
        return $this->belongsTo(Banco::class, 'banco_emisor_id');
    }

    public function bancoDestino()
    {
        return $this->belongsTo(Banco::class, 'banco_destino_id');
    }

    public function cuentaDestino()
    {
        return $this->belongsTo(CuentaBancaria::class, 'cuenta_destino_id');
    }
}
