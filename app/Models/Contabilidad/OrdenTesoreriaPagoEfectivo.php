<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenTesoreriaPagoEfectivo extends Model
{
    use HasFactory;

    protected $table = 'orden_tesoreria_pago_efectivos';

    protected $fillable = [
        'orden_tesoreria_id',
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
}
