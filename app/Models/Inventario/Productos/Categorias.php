<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Categorias extends Model
{
    protected $table='productos_categorias';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];
}
