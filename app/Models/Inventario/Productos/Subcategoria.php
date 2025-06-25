<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Subcategoria extends Model
{
    protected $table='productos_subcategorias';
    public $timestamps = false;

    
    protected $fillable = [
    
        'descripcion',
        'categoria_id',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

     public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categorias', 'id_categorias');
    }
}
