<?php

namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ControlAcceso\User;

class ActividadEconomicaProveedor extends Model
{
    use HasFactory;

    protected $table = 'actividades_economicas_proveedores';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'habilitado',
        'fecha_creacion',
        'usuario_creacion',
        'fecha_actualizacion',
        'usuario_actualizacion',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    public function proveedores()
    {
        return $this->belongsToMany(Proveedor::class, 'relacion_proveedor_actividad', 'id_actividad', 'id_proveedor')
                    ->withPivot(['fecha_creacion', 'usuario_creacion']);
    }
}
