<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class InmuebleTipoContacto extends Model
{
    protected $table = 'inmueble_tipo_contacto';
     public $timestamps = false;


    protected $fillable = [
        
        'descripcion',    
    ];

    public function contactos()
    {
        return $this->hasMany(InmuebleContacto::class, 'inmuebles_tipo_contacto_id');
    }


    
}
