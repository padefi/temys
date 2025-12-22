<?php

namespace App\Models\Georef;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Localidad extends Model
{
    protected $table = 'georef_localidades';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'categoria',
        'centroide_lat',
        'centroide_lon',
        'departamento_id',
        'departamento_nombre',
        'fuente',
        'localidad_censal_id',
        'localidad_censal_nombre',
        'municipio_id',
        'municipio_nombre',
        'nombre',
        'provincia_id',
        'provincia_nombre',
    ];

    protected $casts = [
        'centroide_lat' => 'float',
        'centroide_lon' => 'float',
    ];

    /**
     * Relación con provincia
     */
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class, 'provincia_id', 'id');
    }

    /**
     * Relación con departamento
     */
    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'departamento_id', 'id');
    }

    /**
     * Relación con calles
     */
    public function calles(): HasMany
    {
        return $this->hasMany(Calle::class, 'localidad_censal_id', 'localidad_censal_id');
    }

    /**
     * Scope para búsqueda por nombre
     */
    public function scopeBuscarPorNombre($query, string $nombre)
    {
        return $query->where('nombre', 'LIKE', "%{$nombre}%")
                     ->orWhereFullText('nombre', $nombre);
    }

    /**
     * Scope para filtrar por provincia
     */
    public function scopePorProvincia($query, string $provinciaGeorefId)
    {
        return $query->where('provincia_id', $provinciaGeorefId);
    }

    /**
     * Scope para filtrar por departamento
     */
    public function scopePorDepartamento($query, string $departamentoGeorefId)
    {
        return $query->where('departamento_id', $departamentoGeorefId);
    }
}
