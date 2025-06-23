<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class TipoOcupacion extends Model
{
    protected $table = 'inmuebles_tipo_ocupacion';

    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

      public function inmuebles()
    {
        return $this->hasMany(Inmueble::class, 'tipo_ocupacion_id');
    }
}
