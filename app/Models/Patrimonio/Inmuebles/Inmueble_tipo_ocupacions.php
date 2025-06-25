<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class Inmueble_tipo_ocupacions extends Model
{


    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

      public function inmuebles()
    {
        return $this->hasMany(Inmueble::class, 'tipo_ocupacion_id');
    }
}
