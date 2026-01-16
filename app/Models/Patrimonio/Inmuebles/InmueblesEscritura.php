<?php

namespace App\Models\Patrimonio\Inmuebles;

use App\Models\Patrimonio\Inmuebles\Inmueble;
use Illuminate\Database\Eloquent\Model;

class InmueblesEscritura extends Model
{
     protected $table = 'inmuebles_escritura';
     public $timestamps = false;


    protected $fillable = [
        'inmuebles_id',
        'nro_escritura',
        'fecha_escritura',
        'fecha_inscripcion',
        'folio',
        'tomo',
        'observacion',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];


    protected $casts = [
        'fecha_escritura' => 'datetime',
        'fecha_inscripcion' => 'datetime',   
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',     
    ];
    public function inmueble()
    {
        return $this->belongsTo(Inmueble::class, 'inmuebles_id');
    }

}
