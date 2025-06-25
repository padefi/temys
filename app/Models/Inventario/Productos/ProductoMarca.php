<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class ProductoMarca extends Model
{
   
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

      public function modelos()
    {
        return $this->hasMany(ProductoModelo::class, 'id_marca', 'id_marca');
    }
}
