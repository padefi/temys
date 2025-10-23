<?php

namespace App\Models\Patrimonio\Inmuebles;


use App\Models\Patrimonio\Inmuebles\Inmueble;
use Illuminate\Database\Eloquent\Model;

class InmuebleContrato extends Model
{
    public $timestamps = false;


    protected $fillable = [
        'inmuebles_id',
        'inmuebles_tipo_contrato_id',
        'fecha_contrato',
        'fecha_inicio',
        'fecha_final',
        'importe',
        'observacion',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];


    protected $casts = [
        'fecha_contrato' => 'datetime',
        'fecha_inicio' => 'datetime',
        'fecha_final' => 'datetime',    
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',     
    ];

    
         public function contrato()
    {
        return $this->belongsTo(InmuebleContrato::class, 'tipo_contrato_id');
    }

     public function inmueble()
    {
        return $this->belongsTo(Inmueble::class, 'inmuebles_id');
    }
}
