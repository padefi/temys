<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Producto_marca extends Model
{
   
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

      public function modelos()
    {
        return $this->hasMany(Producto_modelo::class, 'id_marca', 'id_marca');
    }
}
