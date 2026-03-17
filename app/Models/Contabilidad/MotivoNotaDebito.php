<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoNotaDebito extends Model
{
    use HasFactory;

    protected $table = 'motivos_nota_debito';

    protected $fillable = [
        'codigo',
        'descripcion',
        'categoria',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /* Scopes útiles */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
