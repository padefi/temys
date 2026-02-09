<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoNotaCredito extends Model
{
    use HasFactory;

    protected $table = 'motivos_nota_credito';

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
