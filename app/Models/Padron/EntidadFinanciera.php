<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ControlAcceso\User;
use App\Models\General\Nacionalidad;

class EntidadFinanciera extends Model
{
    use HasFactory;

    protected $table = 'entidades_financieras';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'tipo',
        'nacionalidad',
        'clave_unica',
        'habilitado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'habilitado' => 'boolean',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    //Relación con Nacionalidades
    public function nacionalidad()
    {
        return $this->belongsTo(Nacionalidad::class, 'nacionalidad');
    }

    /* public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    public function usuarioActualizacion()
    {
        return $this->belongsTo(User::class, 'usuario_actualizacion');
    } */
}