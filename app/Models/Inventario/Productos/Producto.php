<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
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
        'num_serie',
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
        'peso'=>'float',
        'alto'=>'float',
        'ancho'=>'float',
        'volumen'=>'float',
        'profundidad'=>'float',
    ];


    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'id_modelo', 'id_modelo');
    }

    public function subCategoria()
    {
        return $this->belongsTo(SubCategoria::class, 'id_subcategoria', 'id');
    }

    public function caracteristicas()
    {
        return $this->belongsToMany(
            Caracteristica::class,
            'relacion_producto_caracteristicas',
            'id_prod',
            'id_caracteristicas'
        );
    }
}
