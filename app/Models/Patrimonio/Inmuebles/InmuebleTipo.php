<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class InmuebleTipo extends Model
{
    protected $table='inmuebles_tipo';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

     public function inmuebles()
    {
        return $this->hasMany(Inmueble::class, 'tipo_inmueble_id');
    }
}
