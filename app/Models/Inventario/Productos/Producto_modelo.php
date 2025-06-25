<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto_modelo extends Model
{
    use HasFactory;
  
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
        'marca_id',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    public function marca()
    {
        return $this->belongsTo(Producto_marca::class, 'id_marca', 'id_marca');
    }
}
