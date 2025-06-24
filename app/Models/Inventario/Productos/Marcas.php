<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Marcas extends Model
{
    protected $table='productos_marcas';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];
}
