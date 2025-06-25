<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
    protected $table = 'productos';
    public $timestamps = false;


    protected $fillable = [

        'nombre',
        'descripcion',
        'modelo_id',
        'subcategoria_id',
        'peso',
        'alto',
        'ancho',
        'volumen',
        'profundidad',
        'cod_barras',
        'es_inventario',
        'es_patrimonio',
        'referencia',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
        'peso' => 'float',
        'alto' => 'float',
        'ancho' => 'float',
        'volumen' => 'float',
        'profundidad' => 'float',
    ];


    public function modelo()
    {
        return $this->belongsTo(Producto_modelo::class, 'id_modelo', 'id_modelo');
    }

    public function subCategoria()
    {
        return $this->belongsTo(Producto_subcategoria::class, 'id_subcategoria', 'id');
    }

    public function caracteristicas()
    {
        return $this->belongsToMany(
            Producto_caracteristica::class,
            'relacion_producto_caracteristica',
            'caracteristica_id', // FK de este modelo (Caracteristica)
            'producto_id'        // FK del otro modelo (Producto)
        );
    }
}
