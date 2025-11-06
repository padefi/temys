<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class InmuebleContacto extends Model
{
    protected $table = 'inmueble_contacto';
       public $timestamps = false;

      protected $fillable = [
        'inmuebles_id',
        'inmuebles_tipo_contacto_id',
        'contacto',
        'descripcion',    
    ];


     public function tipoContacto()
    {
        return $this->belongsTo(InmuebleTipoContacto::class, 'inmuebles_tipo_contacto_id');
    }
    
    public function inmueble()
    {
        return $this->belongsTo(Inmueble::class, 'inmuebles_id');
    }
}
