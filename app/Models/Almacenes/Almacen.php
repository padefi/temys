<?php

namespace App\Models\Almacenes;

use App\Models\Compras\OrdenCompra;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Stock;
use Illuminate\Database\Eloquent\Model;

class Almacen extends Model
{
    protected $table = 'almacenes';
    public $timestamps = false;

    
    protected $fillable = [
    
        'nombre',
        'tipo',
        'responsable_id',
        'almacen_padre_id',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];


    public function responsable()
    {
        return $this->belongsTo(User::class, 'id_responsable', 'id_user');
    }

    public function padre()
    {
        return $this->belongsTo(Almacen::class, 'almacen_padre_id');
    }

    public function hijos()
    {
        return $this->hasMany(Almacen::class, 'almacen_padre_id');
    }

    public function direcciones()
    {
        return $this->hasMany(Domicilio::class, 'id_almacen');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'almacen_id');
    }

    public function ordenesDestino()
    {
        return $this->hasMany(OrdenCompra::class, 'almacen_destino_id');
    }
}
