<?php

namespace App\Models\Patrimonio\Inmuebles;

use App\Models\Patrimonio\Inmuebles\Localidad;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    protected $table='provincias';

    protected $fillable = ['nombre'];

    public function localidades()
    {
        return $this->hasMany(Localidad::class);
    }
}
