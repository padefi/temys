<?php

namespace App\Models\Almacenes;

use Illuminate\Database\Eloquent\Model;

class AlmacenDomicilio extends Model
{
  
    public $timestamps = false;

    
    protected $fillable = [
    
        'almacen_id',
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

       public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }
}
