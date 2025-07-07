<?php
namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;
use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventarioSolicitarStock extends Model
{
    use HasFactory;

 

    public $timestamps = false;

    protected $fillable = [
        'producto_id',
        'almacen_solicitante_id',
        'almacen_proovedor_id',
        'cantidad_solicitada',
        'prioridad',
        'motivo',
        'fecha_creacion',
        'usuario_creacion',
    ];



    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function almacensolicitante()
    {
        return $this->belongsTo(Almacen::class, 'almacen_solicitante_id');
    }

    public function almacenProovedor()
    {
        return $this->belongsTo(Almacen::class, 'almacen_proovedor_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }
}
