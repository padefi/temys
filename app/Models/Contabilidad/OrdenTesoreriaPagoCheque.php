<?php

namespace App\Models\Contabilidad;

use App\Models\Contabilidad\OrdenTesoreria;
use App\Models\ControlAcceso\User;
use App\Models\General\Cheque;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenTesoreriaPagoCheque extends Model
{
    use HasFactory;

    protected $table = 'orden_tesoreria_pago_cheques';

    protected $fillable = [
        'orden_tesoreria_id',
        'cheque_id',
        'numero_cheque',
        'fecha_cheque',
        'numero_operacion',
        'usuario_creacion',
    ];

    // ================= RELACIONES =================

    public function ordenTesoreria()
    {
        return $this->belongsTo(OrdenTesoreria::class, 'orden_tesoreria_id');
    }

    public function cheque()
    {
        return $this->belongsTo(Cheque::class, 'cheque_id');
    }

    public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
}
