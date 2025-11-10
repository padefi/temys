<?php

namespace App\Models\Padron\Proveedor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProveedorCbu extends Model
{
    use HasFactory;

    protected $table = 'proveedor_cbus';

    protected $fillable = [
        'proveedor_id',
        'cbu',
        'alias',
        'banco',
        'tipo_cuenta',
        'predeterminado',
    ];
    ////PROVEEDOR RELACIONADO
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }
}
