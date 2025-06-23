<?php

namespace App\Models\Patrimonio\Inmuebles;

use Illuminate\Database\Eloquent\Model;

class TipoEstado extends Model
{
    protected $table = 'inmuebles_tipo_estado'; 
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];
  public function inmuebles()
    {
        return $this->hasMany(Inmueble::class, 'estado_id');
    }
}
