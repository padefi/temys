<?php

namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/* use App\Models\ControlAcceso\User; */

class RelacionProveedorActividad extends Model
{
    use HasFactory;

    protected $table = 'relacion_proveedor_actividad';

    public $timestamps = false;

    protected $fillable = [
        'id_actividad',
        'id_proveedor',
        'fecha_creacion',
        'usuario_creacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    //Actividad económica
    public function actividadEconomica()
    {
        return $this->belongsTo(ActividadEconomicaProveedor::class, 'id_actividad');
    }

    //Proveedor
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }

    //Usuario creador
    /* public function usuarioCreacion()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    } */
}
