<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    protected $table = 'productos_caracteristicas';
    public $timestamps = false;


    protected $fillable = [
        'descripcion',
    ];

    public function productos()
    {
        return $this->belongsToMany(
            Producto::class,
            'relacion_producto_caracteristicas',
            'id_caracteristicas',
            'id_prod'
        );
    }
}
