<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class InmueblesHistorialCatastrales extends Model
{
       protected $table = 'inmueble_historial_catastrales';
     public $timestamps = false;


    protected $fillable = [
        'id_escritura',
        'circunscripcion',
        'manzana',
        'parcela',
        'poligono',
        'zona',
        'partida',
        'valuacion_fiscal',
 
    ];



    public function escritura()
    {
        return $this->belongsTo(InmueblesEscritura::class, 'id_escritura');
    }

}
