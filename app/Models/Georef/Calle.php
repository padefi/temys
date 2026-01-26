<?php

namespace App\Models\Georef;

use App\Models\Patrimonio\Inmuebles\Inmueble;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calle extends Model
{
    protected $table = 'georef_calles';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'altura_fin_derecha',
        'altura_fin_izquierda',
        'altura_inicio_derecha',
        'altura_inicio_izquierda',
        'nombre',
        'categoria',
        'departamento_id',
        'departamento_nombre',
        'fuente',
        'localidad_censal_id',
        'localidad_censal_nombre',
        'localidad_id',
        'localidad_nombre',
        'provincia_id',
        'provincia_nombre',
    ];

    protected $casts = [
        'altura_fin_derecha' => 'integer',
        'altura_fin_izquierda' => 'integer',
        'altura_inicio_derecha' => 'integer',
        'altura_inicio_izquierda' => 'integer',
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
     * Relación con localidad
     */
    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class, 'localidad_censal_id', 'localidad_censal_id');
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
     * Scope para filtrar por localidad
     */
    public function scopePorLocalidad($query, string $localidadGeorefId)
    {
        return $query->where('localidad_censal_id', $localidadGeorefId);
    }

    /**
     * Verifica si una altura está en el rango de la calle
     */
    public function contieneAltura(int $altura): bool
    {
        $inicioDerecha = $this->altura_inicio_derecha;
        $finDerecha = $this->altura_fin_derecha;
        $inicioIzquierda = $this->altura_inicio_izquierda;
        $finIzquierda = $this->altura_fin_izquierda;

        $matchDerecha = $inicioDerecha !== null && $finDerecha !== null
            ? ($altura >= min($inicioDerecha, $finDerecha) && $altura <= max($inicioDerecha, $finDerecha))
            : false;

        $matchIzquierda = $inicioIzquierda !== null && $finIzquierda !== null
            ? ($altura >= min($inicioIzquierda, $finIzquierda) && $altura <= max($inicioIzquierda, $finIzquierda))
            : false;

        return $matchDerecha || $matchIzquierda;
    }

     public function inmuebles()
    {
        return $this->hasMany(Inmueble::class);
    }
}
