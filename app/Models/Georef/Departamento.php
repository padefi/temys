<?php

namespace App\Models\Georef;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model
{
    protected $table = 'georef_departamentos';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'categoria',
        'centroide_lat',
        'centroide_lon',
        'fuente',
        'nombre',
        'nombre_completo',
        'provincia_id',
        'provincia_interseccion',
        'provincia_nombre',
    ];

    protected $casts = [
        'centroide_lat' => 'float',
        'centroide_lon' => 'float',
        'provincia_interseccion' => 'float',
    ];

    /**
     * Relación con provincia
     */
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class, 'provincia_id', 'id');
    }

    /**
     * Relación con localidades
     */
    public function localidades(): HasMany
    {
        return $this->hasMany(Localidad::class, 'departamento_id', 'id');
    }

    /**
     * Relación con calles
     */
    public function calles(): HasMany
    {
        return $this->hasMany(Calle::class, 'departamento_id', 'id');
    }

    /**
     * Scope para búsqueda por nombre
     */
    public function scopeBuscarPorNombre($query, string $nombre)
    {
        return $query->where('nombre', 'LIKE', "%{$nombre}%");
    }

    /**
     * Scope para filtrar por provincia
     */
    public function scopePorProvincia($query, string $provinciaGeorefId)
    {
        return $query->where('provincia_id', $provinciaGeorefId);
    }
}
