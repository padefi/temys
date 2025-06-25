<?php

namespace App\Models\Inventario\Productos;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $table='productos_marcas';
    public $timestamps = false;

    
    protected $fillable = [
        'descripcion',
    ];

      public function modelos()
    {
        return $this->hasMany(Modelo::class, 'id_marca', 'id_marca');
    }
}
