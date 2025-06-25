<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Producto_categoria extends Model
{
   
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

     public function subCategorias()
    {
        return $this->hasMany(Producto_subcategoria::class, 'id_categorias', 'id_categorias');
    }
}
