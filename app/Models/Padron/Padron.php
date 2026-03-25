<?php

namespace App\Models\Padron;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\General\Nacionalidad;

class Padron extends Model
{
    use HasFactory;

    protected $table = 'padron';

    public $timestamps = false;

    protected $fillable = [
        'tipo_documento',
        'documento',
        'nacionalidad',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'tipo_documento' => 'string',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    //Cliente relacionado
    public function cliente()
    {
        return $this->hasOne(\App\Models\Padron\Cliente\Cliente::class, 'id_padron');
    }

    //Nacionalidad
    public function nacionalidad()
    {
        return $this->belongsTo(Nacionalidad::class, 'nacionalidad');
    }
}
