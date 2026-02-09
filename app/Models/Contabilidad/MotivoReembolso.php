<?php

namespace App\Models\Contabilidad;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoReembolso extends Model
{
    use HasFactory;

    protected $table = 'motivos_reembolso';

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
