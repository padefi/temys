<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CondicionVenta extends Model
{
    use HasFactory;

    protected $table = 'condiciones_venta';

    protected $fillable = [
        'nombre',
        'descripcion',
        'habilitado',
    ];
}
