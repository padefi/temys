<?php

namespace App\Models\Contabilidad;

use App\Models\Compras\OrdenPago;
use App\Models\Contabilidad\Comprobante;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\General\TipoTramite;
use App\Models\Ventas\OrdenCobro;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plan';
    protected $fillable = ['tipo', 'cantidad_cuotas'];
    ////TIPO TRAMITE RELACIONADO
    public function tipoTramites()
    {
        return $this->belongsToMany(TipoTramite::class, 'tipo_tramite_plan_pago');
    }
    ////ORDENES DE TESORERIA RELACIONADAS
    public function ordenesTesoreria()
    {
        return $this->hasMany(OrdenTesoreria::class);
    }

    ////COMPROBANTES RELACIONADOS
    public function comprobantes()
    {
        return $this->belongsToMany(
            Comprobante::class,
            'relacion_comprobantes_plan',
            'plan_id',              // FK local
            'comprobante_id'    // FK relacionada
        );
    }



}
