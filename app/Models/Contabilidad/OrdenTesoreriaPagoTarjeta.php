<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\Tarjeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenTesoreriaPagoTarjeta extends Model
{
    use HasFactory;

    protected $table = 'orden_tesoreria_pago_tarjetas';

    protected $fillable = [
        'orden_tesoreria_id',
        'tarjeta_origen_id',
        'numero_operacion',
        'usuario_creacion',
    ];

    // ================= RELACIONES =================

    public function ordenTesoreria()
    {
        return $this->belongsTo(OrdenTesoreria::class, 'orden_tesoreria_id');
    }

    public function tarjetaOrigen()
    {
        return $this->belongsTo(Tarjeta::class, 'tarjeta_origen_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
}
