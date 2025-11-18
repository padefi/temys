<?php

namespace App\Models\Inventario;

use App\Models\Inventario\Productos\Producto;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventarioAjusteDetalle extends Model
{
    protected $fillable = [
        'ajuste_inventario_id',
        'producto_id',
        'cantidad_sistema',
        'cantidad_contada',
    ];

    public $timestamps = false;

    public function ajuste(): BelongsTo
    {
        return $this->belongsTo(InventarioAjuste::class, 'ajuste_inventario_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    
}
