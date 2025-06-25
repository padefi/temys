<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table='productos_categorias';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

     public function subCategorias()
    {
        return $this->hasMany(SubCategoria::class, 'id_categorias', 'id_categorias');
    }
}
