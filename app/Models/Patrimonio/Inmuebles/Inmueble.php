<?php

namespace App\Models\Patrimonio\Inmuebles;

use App\Models\ControlAcceso\User;


use App\Models\InmuebleTipoContrato;
use Illuminate\Database\Eloquent\Model;

class Inmueble extends Model
{

    public $timestamps = false;


    protected $fillable = [

        'num_partida',
        'estado_id',
        'nombre_completo',
        'nombre_fantasia',
        'id_calle',
        'numero',
        'tipo_inmueble_id',
        'tipo_ocupacion_id',
        'superficie_cubierta',
        'superficie_libre',
        'superficie_total',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];


    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
        'superficie_cubierta' => 'float',
        'superficie_libre' => 'float',
        'superficie_total' => 'float',
    ];


    public function estado()
    {
        return $this->belongsTo(InmuebleTipoEstado::class, 'estado_id');
    }

    public function tipoInmueble()
    {
        return $this->belongsTo(InmuebleTipo::class, 'tipo_inmueble_id');
    }

    public function tipoOcupacion()
    {
        return $this->belongsTo(InmuebleTipoOcupacions::class, 'tipo_ocupacion_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    public function actualizador()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    }
    public function contratos()
    {
        return $this->hasMany(InmuebleContrato::class, 'inmuebles_id');
    }

    public function escrituras()
    {
        return $this->hasMany(InmuebleEscritura::class, 'inmuebles_id');
    }

    public function contactos()
    {
        return $this->hasMany(InmuebleContacto::class, 'inmuebles_id');
    }

    
}
