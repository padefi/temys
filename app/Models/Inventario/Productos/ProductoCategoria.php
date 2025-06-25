<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class ProductoCategoria extends Model
{
   
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

     public function subCategorias()
    {
        return $this->hasMany(ProductoSubcategoria::class, 'id_categorias', 'id_categorias');
    }
}
