<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoMoneda extends Model
{
    use HasFactory;



    protected $fillable = [
        'codigo',
        'descripcion',
        'simbolo',
        'pais_origen',
    ];




}
