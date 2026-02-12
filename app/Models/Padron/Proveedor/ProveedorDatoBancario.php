<?php

namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Padron\EntidadFinanciera;
use App\Models\General\TipoMoneda;

class ProveedorDatoBancario extends Model
{
    use HasFactory;

    protected $table = 'proveedor_datos_bancarios';

    public $timestamps = false;

    protected $fillable = [
        'id_proveedor',
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
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
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
