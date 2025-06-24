<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Productos extends Model
{
    // Desactivar timestamps automáticos (created_at y updated_at)
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
}
