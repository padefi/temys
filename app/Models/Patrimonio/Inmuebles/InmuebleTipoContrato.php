<?php

namespace App\Models\Patrimonio\Inmuebles;

use App\Models\Patrimonio\Inmuebles\Inmueble;
use Illuminate\Database\Eloquent\Model;

class InmuebleTipoContrato extends Model
{
    public $timestamps = false;


    protected $fillable = [
        'descripcion',
    ];


    public function contratos()
    {
        return $this->hasMany(InmuebleContrato::class, 'inmuebles_tipo_contrato_id');
    }
}
