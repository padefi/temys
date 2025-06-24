<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Caracteristicas extends Model
{
    protected $table='productos_caracteristicas';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];
}
