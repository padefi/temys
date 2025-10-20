<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class TipoCatastro extends Model
{
     protected $table = 'inmueble_tipo_catastro';
     public $timestamps = false;


    protected $fillable = [
        
        'descripcion',    
    ];

}
