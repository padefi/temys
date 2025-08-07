<?php

namespace App\Models\Inventario;

use App\Models\Almacenes\Almacen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User;

class InventarioAjuste extends Model
{
       protected $fillable = [ 
        'fecha_ajuste',
        'almacen_destino_id',
        'usuario_creacion',
        'estado_ajuste',
        'motivo'
       ];

    public $timestamps = false;

    public function detalles(): HasMany
    {
        return $this->hasMany(InventarioAjusteDetalle::class, 'ajuste_inventario_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_creacion');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_destino_id');
    }
}
