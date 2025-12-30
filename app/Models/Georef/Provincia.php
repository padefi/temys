<?php

namespace App\Models\Georef;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provincia extends Model
{
    protected $table = 'georef_provincias';

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
        'iso_id',
        'iso_nombre',
    ];

    protected $casts = [
        'centroide_lat' => 'float',
        'centroide_lon' => 'float',
    ];

    /**
     * Relación con departamentos
     */
    public function departamentos(): HasMany
    {
        return $this->hasMany(Departamento::class, 'provincia_id', 'id');
    }

    /**
     * Relación con localidades
     */
    public function localidades(): HasMany
    {
        return $this->hasMany(Localidad::class, 'provincia_id', 'id');
    }

    /**
     * Relación con calles
     */
    public function calles(): HasMany
    {
        return $this->hasMany(Calle::class, 'provincia_id', 'id');
    }

    /**
     * Scope para búsqueda por nombre
     */
    public function scopeBuscarPorNombre($query, string $nombre)
    {
        return $query->where('nombre', 'LIKE', "%{$nombre}%");
    }
}
