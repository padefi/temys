<?php

namespace App\Models\Patrimonio\Inmuebles;

use App\Models\Patrimonio\Inmuebles\Localidad;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calle extends Model
{
    protected $table='calles';

    protected $fillable = ['nombre', 'localidad_id'];

    public function localidad()
    {
        return $this->belongsTo(Localidad::class);
    }
}
