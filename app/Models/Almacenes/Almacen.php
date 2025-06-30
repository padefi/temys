<?php

namespace App\Models\Almacenes;


use App\Models\Compras\OrdenCompra;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\InventarioStock;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Almacen extends Model
{
    use HasFactory;
    
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
        return $this->belongsTo(User::class, 'responsable_id', 'user_id');
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
        return $this->hasMany(AlmacenDomicilio::class, 'almacen_id');
    }

    public function stocks()
    {
        return $this->hasMany(InventarioStock::class, 'almacen_id');
    }

    public function ordenesDestino()
    {
        return $this->hasMany(OrdenCompra::class, 'almacen_destino_id');
    }
}
