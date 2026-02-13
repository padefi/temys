<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Padron\EntidadFinanciera;
use App\Models\General\TipoMoneda;

class PadronDatoBancario extends Model
{
    use HasFactory;

    protected $table = 'padron_datos_bancarios';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'tipo_id',
        'tipo_clave',
        'clave',
        'alias',
        'entidad_financiera',
        'moneda',
        'tipo_cuenta',
        'predeterminado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'predeterminado' => 'boolean',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    //Relaciones
    public function titular()
    {
        return $this->morphTo(null, 'tipo', 'tipo_id');
    }

    public function entidadFinanciera()
    {
        return $this->belongsTo(EntidadFinanciera::class, 'entidad_financiera');
    }

    public function tipoMoneda()
    {
        return $this->belongsTo(TipoMoneda::class, 'moneda');
    }
}
