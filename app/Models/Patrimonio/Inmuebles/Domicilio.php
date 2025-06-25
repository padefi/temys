<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class Domicilio extends Model
{
    protected $table='inmuebles_domicilios';
    public $timestamps = false;

    
    protected $fillable = [
        'inmueble_id',
        'calle_id',
        'altura',
        'codigo_postal',
        'observacion',
        'piso',
        'departamento',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

}
